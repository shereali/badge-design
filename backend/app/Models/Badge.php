<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Badge extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'title',
        'badge_type',
        'access_level',
        'size_preset',
        'orientation',
        'width',
        'height',
        'unit',
        'active_side',
        'page_config',
        'front_boxes',
        'back_boxes',
        'layers',
        'settings',
        'preview_image',
    ];

    protected $casts = [
        'page_config' => 'array',
        'front_boxes' => 'array',
        'back_boxes' => 'array',
        'layers' => 'array',
        'settings' => 'array',
        'width' => 'float',
        'height' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

