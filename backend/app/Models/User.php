<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'plan',
        'plan_name',
        'subscription_status',
        'subscription_ends_at',
        'badge_limit',
        'billing_cycle',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'subscription_ends_at' => 'datetime',
            'badge_limit' => 'integer',
            'password' => 'hashed',
        ];
    }

    public function badges()
    {
        return $this->hasMany(Badge::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function refundRequests()
    {
        return $this->hasMany(RefundRequest::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin'
            || $this->email === 'shere0991@gmail.com'
            || $this->email === 'admin@softcredible.com'
            || $this->email === 'admin@porichoyid.softcredible.com';
    }
}
