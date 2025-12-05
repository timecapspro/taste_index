<?php

namespace App\Http\Controllers;

use App\Models\Film;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MeController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/me/stats",
     *     summary="Статистика профиля",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        return [
            'favorites' => DB::table('favorites')->where('user_id', $user->id)->count(),
            'watch_later' => DB::table('watch_later')->where('user_id', $user->id)->count(),
            'ratings' => Rating::where('user_id', $user->id)->count(),
            'submissions' => Film::where('created_by_user_id', $user->id)->count(),
        ];
    }
}
