<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    use HasFactory;

    protected $fillable = [
        'title','original_title','year','duration_min','director','description','is_18_plus',
        'poster_path','poster_original_path','poster_crop_json','created_by_user_id','status','reject_reason',
        'premiere_at','producer','cinematographer','composer','budget'
    ];

    protected $casts = [
        'poster_crop_json' => 'array',
        'is_18_plus' => 'boolean'
    ];

    public function genres()
    {
        return $this->belongsToMany(Genre::class, 'film_genre');
    }

    public function countries()
    {
        return $this->belongsToMany(Country::class, 'film_country');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }
}
