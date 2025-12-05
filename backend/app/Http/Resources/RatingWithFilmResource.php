<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RatingWithFilmResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'rating' => (int) $this->rating,
            'film' => new FilmResource($this->film),
        ];
    }
}
