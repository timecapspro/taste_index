<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DictionaryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/genres",
     *     summary="Справочник жанров",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Список жанров",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Комедия")
     *         ))
     *     )
     * )
     */
    public function genres()
    {
        return DB::table('genres')->select('id', 'name')->orderBy('name')->get();
    }

    /**
     * @OA\Get(
     *     path="/api/countries",
     *     summary="Справочник стран",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Список стран",
     *         @OA\JsonContent(type="array", @OA\Items(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Россия")
     *         ))
     *     )
     * )
     */
    public function countries()
    {
        return DB::table('countries')->select('id', 'name')->orderBy('name')->get();
    }
}
