<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class DictionaryController extends Controller
{
    /**
     * @OA\Get(path="/api/genres", summary="Справочник жанров", security={{"bearerAuth":{}}})
     */
    public function genres()
    {
        return DB::table('genres')->select('id', 'name')->orderBy('name')->get();
    }

    /**
     * @OA\Get(path="/api/countries", summary="Справочник стран", security={{"bearerAuth":{}}})
     */
    public function countries()
    {
        return DB::table('countries')->select('id', 'name')->orderBy('name')->get();
    }
}
