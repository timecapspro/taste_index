<?php

namespace App\Http\Controllers;

use App\Http\Resources\RatingWithFilmResource;
use App\Http\Resources\UserResource;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserController extends Controller
{
    /**
     * @OA\Get(path="/api/users", summary="Список пользователей", security={{"bearerAuth":{}}})
     */
    public function index(Request $request)
    {
        $authUser = $request->user();
        $perPage = (int) $request->input('per_page', 12);
        $page = (int) $request->input('page', 1);

        $users = User::where('id', '!=', $authUser->id)->get();

        $currentRatings = Rating::where('user_id', $authUser->id)->get()->keyBy('film_id');
        $otherRatings = Rating::whereIn('user_id', $users->pluck('id'))
            ->get()
            ->groupBy('user_id')
            ->map(fn ($group) => $group->keyBy('film_id'));

        $usersWithMatch = $users->map(function (User $user) use ($currentRatings, $otherRatings) {
            $user->match_percent = $this->calculateMatchPercentFromCollections(
                $currentRatings,
                $otherRatings->get($user->id, collect())
            );

            return $user;
        })->sortByDesc('match_percent')->values();

        $slice = $usersWithMatch->forPage($page, $perPage);
        $paginator = new LengthAwarePaginator(
            $slice,
            $usersWithMatch->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return UserResource::collection($paginator);
    }

    /**
     * @OA\Get(path="/api/users/{id}", summary="Профиль пользователя", security={{"bearerAuth":{}}})
     */
    public function show(Request $request, $id)
    {
        $authUser = $request->user();
        $targetUser = User::findOrFail($id);

        $perPage = (int) $request->input('per_page', 12);

        $ratings = Rating::with(['film.genres', 'film.countries'])
            ->where('user_id', $targetUser->id)
            ->paginate($perPage);

        $filmIds = $ratings->getCollection()->pluck('film_id');
        $myRatings = Rating::where('user_id', $authUser->id)
            ->whereIn('film_id', $filmIds)
            ->get()
            ->keyBy('film_id');

        $ratings->getCollection()->transform(function (Rating $rating) use ($myRatings) {
            $film = $rating->film;
            $film->user_rating = $rating->rating;
            $film->my_rating = optional($myRatings->get($film->id))->rating;

            return $rating;
        });

        $pairRatings = Rating::whereIn('user_id', [$authUser->id, $targetUser->id])
            ->get()
            ->groupBy('user_id')
            ->map(fn ($group) => $group->keyBy('film_id'));

        $matchPercent = $this->calculateMatchPercentFromCollections(
            $pairRatings->get($authUser->id, collect()),
            $pairRatings->get($targetUser->id, collect())
        );

        return response()->json([
            'user' => new UserResource($targetUser, $matchPercent),
            'ratings' => RatingWithFilmResource::collection($ratings),
        ]);
    }

    private function calculateMatchPercentFromCollections(Collection $currentRatings, Collection $otherRatings): int
    {
        if ($currentRatings->isEmpty() || $otherRatings->isEmpty()) {
            return 0;
        }

        $common = $currentRatings->keys()->intersect($otherRatings->keys());
        $count = $common->count();

        if ($count < 2) {
            return 0;
        }

        $sumDiff = $common->reduce(function ($carry, $filmId) use ($currentRatings, $otherRatings) {
            return $carry + abs($otherRatings->get($filmId)->rating - $currentRatings->get($filmId)->rating);
        }, 0);

        $avgDiff = $sumDiff / $count; // max diff 9

        return (int) round(max(0, 100 - ($avgDiff / 9) * 100));
    }
}
