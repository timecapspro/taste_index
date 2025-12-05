<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    private ?int $match;

    public function __construct($resource, ?int $match = null)
    {
        parent::__construct($resource);
        $this->match = $match;
    }

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'login' => $this->login,
            'email' => $this->email,
            'match_percent' => $this->match ?? $this->match_percent ?? 0,
        ];
    }
}
