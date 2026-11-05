<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'plan',
        'plan_name',
        'price',
        'billing_cycle',
        'status',
        'starts_at',
        'ends_at',
        'payment_method',
        'transaction_id',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function refundRequests()
    {
        return $this->hasMany(RefundRequest::class);
    }
}
