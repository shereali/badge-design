<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RefundRequest;
use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    /**
     * Get the authenticated user's current subscription, usage & history.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Calculate days remaining
        $endsAt = $user->subscription_ends_at ? Carbon::parse($user->subscription_ends_at) : null;
        $now = Carbon::now();
        $daysRemaining = $endsAt && $endsAt->isFuture() ? $now->diffInDays($endsAt) : 0;
        $isExpired = $endsAt ? $endsAt->isPast() : false;

        $badgeCount = $user->badges()->count();

        $plans = [
            [
                'id' => 'starter',
                'name' => 'Starter Plan',
                'badge_limit' => 25,
                'price_monthly' => 19,
                'price_yearly' => 190,
                'features' => [
                    'Up to 25 Badges & ID Cards',
                    'High Resolution PNG & JPG Export',
                    'Single-Sided & Dual-Sided Cards',
                    'Standard Dynamic QR Codes',
                    'Email Support',
                ],
            ],
            [
                'id' => 'pro',
                'name' => 'Professional Pass',
                'badge_limit' => 100,
                'price_monthly' => 49,
                'price_yearly' => 490,
                'features' => [
                    'Up to 100 Badges & ID Cards',
                    'Print-Ready 300 DPI Vector PDF Export',
                    'Custom Lanyard Punch Slots',
                    'Custom Photo & Avatar Uploads',
                    'All Ready-Made Badge Themes',
                    'Priority 24/7 Support',
                ],
                'popular' => true,
            ],
            [
                'id' => 'enterprise',
                'name' => 'Enterprise Studio',
                'badge_limit' => 500,
                'price_monthly' => 129,
                'price_yearly' => 1290,
                'features' => [
                    'Up to 500 Badges & Passes',
                    'Unlimited High-Speed Bulk Generation',
                    'Dedicated Account Manager',
                    'Custom Watermark Removal',
                    'Full API & Webhook Access',
                    '7-Day Money Back Guarantee',
                ],
            ],
        ];

        return response()->json([
            'user' => $user,
            'plan' => $user->plan ?: 'starter',
            'plan_name' => $user->plan_name ?: 'Starter Plan',
            'subscription_status' => $user->subscription_status ?: 'active',
            'subscription_ends_at' => $user->subscription_ends_at,
            'days_remaining' => $daysRemaining,
            'is_expired' => $isExpired,
            'badge_limit' => $user->badge_limit ?: 25,
            'badge_count' => $badgeCount,
            'billing_cycle' => $user->billing_cycle ?: 'monthly',
            'available_plans' => $plans,
            'history' => $user->subscriptions()->latest()->get(),
            'refund_requests' => $user->refundRequests()->latest()->get(),
        ]);
    }

    /**
     * Renew current subscription plan.
     */
    public function renew(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'billing_cycle' => 'sometimes|in:monthly,yearly',
            'payment_method' => 'sometimes|string',
        ]);

        $cycle = $request->billing_cycle ?: ($user->billing_cycle ?: 'monthly');
        $durationDays = $cycle === 'yearly' ? 365 : 30;

        $currentEnd = $user->subscription_ends_at ? Carbon::parse($user->subscription_ends_at) : null;
        $baseDate = ($currentEnd && $currentEnd->isFuture()) ? $currentEnd : Carbon::now();
        $newEnd = $baseDate->copy()->addDays($durationDays);

        $price = $cycle === 'yearly' ? 190.00 : 19.00;
        if ($user->plan === 'pro') {
            $price = $cycle === 'yearly' ? 490.00 : 49.00;
        } elseif ($user->plan === 'enterprise') {
            $price = $cycle === 'yearly' ? 1290.00 : 129.00;
        }

        $user->subscription_status = 'active';
        $user->subscription_ends_at = $newEnd;
        $user->billing_cycle = $cycle;
        $user->save();

        $subscription = $user->subscriptions()->create([
            'plan' => $user->plan ?: 'starter',
            'plan_name' => $user->plan_name ?: 'Starter Plan',
            'price' => $price,
            'billing_cycle' => $cycle,
            'status' => 'active',
            'starts_at' => Carbon::now(),
            'ends_at' => $newEnd,
            'payment_method' => $request->payment_method ?: 'Credit Card / Mobile Banking',
            'transaction_id' => 'RNW-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);

        return response()->json([
            'message' => 'Subscription renewed successfully!',
            'user' => $user,
            'subscription' => $subscription,
        ]);
    }

    /**
     * Upgrade subscription plan.
     */
    public function upgrade(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'plan' => 'required|in:starter,pro,enterprise',
            'billing_cycle' => 'sometimes|in:monthly,yearly',
            'payment_method' => 'sometimes|string',
        ]);

        $planMap = [
            'starter' => ['name' => 'Starter Plan', 'badge_limit' => 25, 'monthly' => 19, 'yearly' => 190],
            'pro' => ['name' => 'Professional Pass', 'badge_limit' => 100, 'monthly' => 49, 'yearly' => 490],
            'enterprise' => ['name' => 'Enterprise Studio', 'badge_limit' => 500, 'monthly' => 129, 'yearly' => 1290],
        ];

        $target = $planMap[$request->plan];
        $cycle = $request->billing_cycle ?: ($user->billing_cycle ?: 'monthly');
        $durationDays = $cycle === 'yearly' ? 365 : 30;
        $newEnd = Carbon::now()->addDays($durationDays);
        $price = $cycle === 'yearly' ? $target['yearly'] : $target['monthly'];

        $user->plan = $request->plan;
        $user->plan_name = $target['name'];
        $user->badge_limit = $target['badge_limit'];
        $user->billing_cycle = $cycle;
        $user->subscription_status = 'active';
        $user->subscription_ends_at = $newEnd;
        $user->save();

        $subscription = $user->subscriptions()->create([
            'plan' => $request->plan,
            'plan_name' => $target['name'],
            'price' => $price,
            'billing_cycle' => $cycle,
            'status' => 'active',
            'starts_at' => Carbon::now(),
            'ends_at' => $newEnd,
            'payment_method' => $request->payment_method ?: 'Credit Card / Mobile Banking',
            'transaction_id' => 'UPG-' . strtoupper(substr(md5(uniqid()), 0, 8)),
        ]);

        return response()->json([
            'message' => "Successfully upgraded to {$target['name']}!",
            'user' => $user,
            'subscription' => $subscription,
        ]);
    }

    /**
     * Submit a refund request.
     */
    public function requestRefund(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'reason' => 'required|string|min:10|max:1000',
            'amount' => 'nullable|numeric|min:1',
            'subscription_id' => 'nullable|uuid',
        ]);

        $defaultAmount = 49.00;
        if ($user->plan === 'starter') $defaultAmount = 19.00;
        if ($user->plan === 'enterprise') $defaultAmount = 129.00;

        $refund = $user->refundRequests()->create([
            'subscription_id' => $request->subscription_id,
            'amount' => $request->amount ?: $defaultAmount,
            'reason' => $request->reason,
            'status' => 'pending',
            'admin_notes' => null,
        ]);

        return response()->json([
            'message' => 'Refund request submitted successfully. Our support team will review within 24-48 hours.',
            'refund' => $refund,
        ]);
    }
}
