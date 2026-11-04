<?php

namespace App\Traits;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToUser
{
    /**
     * Boot the BelongsToUser trait.
     */
    protected static function bootBelongsToUser()
    {
        static::creating(function ($model) {
            if (empty($model->user_id) && auth()->check()) {
                $model->user_id = auth()->id();
            }
        });

        // Apply a global scope to filter all queries by user_id
        static::addGlobalScope('user_id', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where('user_id', auth()->id());
            }
        });
    }

    /**
     * Get the user that owns this model.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
