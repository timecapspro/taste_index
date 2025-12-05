<?php

namespace App\Http\Controllers;

use App\Http\Resources\FilmResource;
use App\Models\Film;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    /**
     * @OA\Get(path="/api/recommendations", summary="Рекомендации", security={{"bearerAuth":{}}})
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $threshold = 10;
        $ratingsCount = Rating::where('user_id', $user->id)->count();

        $baseQuery = Film::query()
            ->where('status', 'published')
            ->with(['genres', 'countries'])
            ->withAvg('ratings', 'rating')
            ->select('*')
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

        $ratedIds = Rating::where('user_id', $user->id)->pluck('film_id')->all();

        if ($ratingsCount < $threshold) {
            $popular = (clone $baseQuery)
                ->whereNotIn('id', $ratedIds)
                ->orderByDesc('ratings_avg_rating')
                ->limit(20)
                ->get();

            return response()->json([
                'need_more_ratings' => true,
                'data' => FilmResource::collection($popular)->resolve(),
            ]);
        }

        $likedFilmIds = Rating::where('user_id', $user->id)
            ->where('rating', '>=', 8)
            ->pluck('film_id');

        $similarUsers = Rating::whereIn('film_id', $likedFilmIds)
            ->where('user_id', '!=', $user->id)
            ->select('user_id', DB::raw('COUNT(*) as overlap'))
            ->groupBy('user_id')
            ->orderByDesc('overlap')
            ->limit(50)
            ->pluck('user_id');

        $recommendations = (clone $baseQuery)
            ->whereNotIn('id', $ratedIds)
            ->when($similarUsers->isNotEmpty(), function ($q) use ($similarUsers) {
                $q->whereExists(function ($sq) use ($similarUsers) {
                    $sq->selectRaw(1)
                        ->from('ratings')
                        ->whereColumn('ratings.film_id', 'films.id')
                        ->whereIn('ratings.user_id', $similarUsers)
                        ->where('ratings.rating', '>=', 8);
                });
            })
            ->orderByDesc('ratings_avg_rating')
            ->limit(20)
            ->get();

        if ($recommendations->isEmpty()) {
            $recommendations = (clone $baseQuery)
                ->whereNotIn('id', $ratedIds)
                ->orderByDesc('ratings_avg_rating')
                ->limit(20)
                ->get();
        }

        return response()->json([
            'need_more_ratings' => false,
            'data' => FilmResource::collection($recommendations)->resolve(),
        ]);
    }
}
