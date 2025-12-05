<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Rating;
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
}
