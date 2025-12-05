<?php

namespace App\Http\Controllers;

use App\Http\Resources\FilmResource;
use App\Models\Film;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilmController extends Controller
{
    /**
     * @OA\Get(
     *   path="/api/films",
     *   summary="Список фильмов",
     *   security={{"bearerAuth":{}}},
     *   @OA\Parameter(name="q", in="query", @OA\Schema(type="string")),
     *   @OA\Parameter(name="year_min", in="query", @OA\Schema(type="integer")),
     *   @OA\Parameter(name="year_max", in="query", @OA\Schema(type="integer")),
     *   @OA\Parameter(name="genres[]", in="query", @OA\Schema(type="array", @OA\Items(type="integer"))),
     *   @OA\Parameter(name="countries[]", in="query", @OA\Schema(type="array", @OA\Items(type="integer"))),
     *   @OA\Parameter(name="sort", in="query", @OA\Schema(type="string", enum={"rating","name","year"})),
     *   @OA\Parameter(name="scope", in="query", @OA\Schema(type="string", enum={"favorites","watch_later","my_ratings"})),
     *   @OA\Response(response=200, description="OK")
     * )
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Film::query()
            ->where('status', 'published')
            ->with(['genres', 'countries'])
            ->withAvg('ratings', 'rating');

        $search = $request->input('q');
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('original_title', 'like', "%{$search}%");
            });
        }

        if ($request->filled('year_min')) {
            $query->where('year', '>=', (int) $request->year_min);
        }
        if ($request->filled('year_max')) {
            $query->where('year', '<=', (int) $request->year_max);
        }

        if ($genreIds = $request->input('genres')) {
            $query->whereHas('genres', function ($q) use ($genreIds) {
                $q->whereIn('genres.id', (array) $genreIds);
            });
        }

        if ($countryIds = $request->input('countries')) {
            $query->whereHas('countries', function ($q) use ($countryIds) {
                $q->whereIn('countries.id', (array) $countryIds);
            });
        }

        $scope = $request->string('scope');

        if ($user && $scope === 'favorites') {
            $query->whereExists(function ($q) use ($user) {
                $q->selectRaw(1)
                    ->from('favorites')
                    ->whereColumn('favorites.film_id', 'films.id')
                    ->where('favorites.user_id', $user->id);
            });
        }

        if ($user && $scope === 'watch_later') {
            $query->whereExists(function ($q) use ($user) {
                $q->selectRaw(1)
                    ->from('watch_later')
                    ->whereColumn('watch_later.film_id', 'films.id')
                    ->where('watch_later.user_id', $user->id);
            });
        }

        if ($user && ($scope === 'rated' || $scope === 'my_ratings')) {
            $query->whereExists(function ($q) use ($user) {
                $q->selectRaw(1)
                    ->from('ratings')
                    ->whereColumn('ratings.film_id', 'films.id')
                    ->where('ratings.user_id', $user->id);
            });
        }

        $sort = $request->string('sort');
        if ($sort === 'rating') {
            $query->orderByDesc('ratings_avg_rating');
        } elseif ($sort === 'year') {
            $query->orderByDesc('year');
        } elseif ($sort === 'my_rating' && $user) {
            $query->orderByDesc('my_rating');
        } else {
            $query->orderBy('title');
        }

        if ($user) {
            $query->select('*')
                ->selectSub(
                    Rating::select('rating')
                        ->whereColumn('film_id', 'films.id')
                        ->where('user_id', $user->id)
                        ->limit(1),
                    'my_rating'
                )
                ->selectSub(
                    DB::table('favorites')->selectRaw('1')
                        ->whereColumn('film_id', 'films.id')
                        ->where('user_id', $user->id)
                        ->limit(1),
                    'is_favorite'
                )
                ->selectSub(
                    DB::table('watch_later')->selectRaw('1')
                        ->whereColumn('film_id', 'films.id')
                        ->where('user_id', $user->id)
                        ->limit(1),
                    'is_watch_later'
                );
        }

        $perPage = (int) $request->input('per_page', 12);
        $films = $query->paginate($perPage)->appends($request->query());

        $filters = [
            'genres' => DB::table('genres')->select('id', 'name')->get(),
            'countries' => DB::table('countries')->select('id', 'name')->get(),
            'years' => [
                'min' => (int) Film::where('status', 'published')->min('year'),
                'max' => (int) Film::where('status', 'published')->max('year'),
            ],
        ];

        return FilmResource::collection($films)->additional([
            'filters' => $filters,
            'scope' => $scope,
        ]);
    }

    /**
     * @OA\Get(path="/api/films/{id}", summary="Детальная карточка", security={{"bearerAuth":{}}})
     */
    public function show(Request $request, Film $film)
    {
        $user = $request->user();
        $film->load(['genres', 'countries'])
            ->loadAvg('ratings', 'rating');

        if ($user) {
            $film->my_rating = Rating::where('film_id', $film->id)->where('user_id', $user->id)->value('rating');
            $film->is_favorite = DB::table('favorites')
                ->where('film_id', $film->id)
                ->where('user_id', $user->id)
                ->exists();
            $film->is_watch_later = DB::table('watch_later')
                ->where('film_id', $film->id)
                ->where('user_id', $user->id)
                ->exists();
            $film->my_note = DB::table('film_notes')
                ->where('film_id', $film->id)
                ->where('user_id', $user->id)
                ->value('note');
        }

        return new FilmResource($film);
    }
}
