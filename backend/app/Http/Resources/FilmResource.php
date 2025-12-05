<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class FilmResource extends JsonResource
{
    public function toArray($request)
    {
        $user = $request->user();
        $blocked = false;
        if ($user && $this->is_18_plus && $user->isMinor()) {
            $blocked = true;
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'original_title' => $this->original_title,
            'year' => $this->year,
            'duration_min' => $this->duration_min,
            'director' => $this->director,
            'description' => $blocked ? null : $this->description,
            'is_18_plus' => (bool) $this->is_18_plus,
            'poster_url' => $blocked ? null : $this->poster_path,
            'blocked' => $blocked,
            'genres' => $this->whenLoaded('genres', function () {
                return $this->genres->map(fn($g) => ['id' => $g->id, 'name' => $g->name]);
            }),
            'countries' => $this->whenLoaded('countries', function () {
                return $this->countries->map(fn($c) => ['id' => $c->id, 'name' => $c->name]);
            }),
            'avg_rating' => round($this->ratings_avg_rating ?? 0, 2),
            'my_rating' => $this->my_rating ? (int) $this->my_rating : null,
            'user_rating' => $this->when(isset($this->user_rating), (int) $this->user_rating),
            'is_favorite' => (bool) ($this->is_favorite ?? false),
            'is_watch_later' => (bool) ($this->is_watch_later ?? false),
            'my_note' => $blocked ? null : ($this->my_note ?? null),
        ];
    }
}
