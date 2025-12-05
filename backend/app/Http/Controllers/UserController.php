<?php

namespace App\Http\Controllers;

use App\Http\Resources\RatingWithFilmResource;
use App\Http\Resources\UserResource;
use App\Models\Rating;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

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

        $currentRatings = Rating::where('user_id', $authUser->id)->get()->keyBy('film_id');

        $users = User::where('id', '!=', $authUser->id)->get()->map(function (User $user) use ($currentRatings, $authUser) {
            $user->match_percent = $this->calculateMatchPercent($authUser, $user, $currentRatings);
            return $user;
        })->sortByDesc('match_percent')->values();

        $slice = $users->forPage($page, $perPage);
        $paginator = new LengthAwarePaginator(
            $slice,
            $users->count(),
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

        $ratings->getCollection()->transform(function (Rating $rating) use ($authUser) {
            $film = $rating->film;
            $film->user_rating = $rating->rating;
            $film->my_rating = Rating::where('film_id', $film->id)->where('user_id', $authUser->id)->value('rating');
            return $rating;
        });

        $currentRatings = Rating::where('user_id', $authUser->id)->get()->keyBy('film_id');
        $matchPercent = $this->calculateMatchPercent($authUser, $targetUser, $currentRatings);

        return response()->json([
            'user' => new UserResource($targetUser, $matchPercent),
            'ratings' => RatingWithFilmResource::collection($ratings),
        ]);
    }

    private function calculateMatchPercent(User $authUser, User $otherUser, $currentRatings)
    {
        if ($authUser->id === $otherUser->id) {
            return 100;
        }

        $otherRatings = Rating::where('user_id', $otherUser->id)->get()->keyBy('film_id');

        $sumDiff = 0;
        $count = 0;
        foreach ($otherRatings as $filmId => $rating) {
            if (isset($currentRatings[$filmId])) {
                $count++;
                $sumDiff += abs($rating->rating - $currentRatings[$filmId]->rating);
            }
        }

        if ($count < 2) {
            return 0;
        }

        $avgDiff = $sumDiff / $count; // max diff 9
        $score = max(0, 100 - ($avgDiff / 9) * 100);

        return (int) round($score);
    }
}
