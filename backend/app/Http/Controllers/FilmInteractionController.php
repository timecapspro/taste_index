<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Rating;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FilmInteractionController extends Controller
{
    public function rate(Request $request, Film $film)
    {
        $data = $request->validate([
            'value' => 'required|integer|min:1|max:10',
        ]);
        Rating::updateOrCreate(
            ['user_id' => $request->user()->id, 'film_id' => $film->id],
            ['rating' => $data['value']]
        );

        return response()->json(['status' => 'ok', 'rating' => $data['value']]);
    }

    public function removeRate(Request $request, Film $film)
    {
        Rating::where('user_id', $request->user()->id)->where('film_id', $film->id)->delete();
        return response()->json(['status' => 'ok']);
    }

    public function favorite(Request $request, Film $film)
    {
        DB::table('favorites')->updateOrInsert([
            'user_id' => $request->user()->id,
            'film_id' => $film->id,
        ]);
        return response()->json(['status' => 'ok']);
    }

    public function unfavorite(Request $request, Film $film)
    {
        DB::table('favorites')->where('user_id', $request->user()->id)->where('film_id', $film->id)->delete();
        return response()->json(['status' => 'ok']);
    }

    public function watchLater(Request $request, Film $film)
    {
        DB::table('watch_later')->updateOrInsert([
            'user_id' => $request->user()->id,
            'film_id' => $film->id,
        ]);
        return response()->json(['status' => 'ok']);
    }

    public function removeWatchLater(Request $request, Film $film)
    {
        DB::table('watch_later')->where('user_id', $request->user()->id)->where('film_id', $film->id)->delete();
        return response()->json(['status' => 'ok']);
    }

    public function getNote(Request $request, Film $film)
    {
        $note = DB::table('film_notes')
            ->where('user_id', $request->user()->id)
            ->where('film_id', $film->id)
            ->value('note');

        return ['text' => $note ?? ''];
    }

    public function saveNote(Request $request, Film $film)
    {
        $data = $request->validate([
            'text' => 'nullable|string',
        ]);

        if (!empty($data['text'])) {
            DB::table('film_notes')->updateOrInsert(
                ['user_id' => $request->user()->id, 'film_id' => $film->id],
                ['note' => $data['text'], 'updated_at' => now(), 'created_at' => now()]
            );
        } else {
            DB::table('film_notes')->where('user_id', $request->user()->id)->where('film_id', $film->id)->delete();
        }

        return ['status' => 'ok'];
    }

    public function markWatched(Request $request, Film $film)
    {
        $userId = $request->user()->id;

        DB::table('watch_later')->where('user_id', $userId)->where('film_id', $film->id)->delete();
        DB::table('watched')->updateOrInsert(
            ['user_id' => $userId, 'film_id' => $film->id],
            ['watched_at' => Carbon::now()]
        );

        $hasRating = Rating::where('user_id', $userId)->where('film_id', $film->id)->exists();

        return ['status' => 'ok', 'need_rating' => !$hasRating];
    }
}
