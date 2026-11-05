<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\RefundRequest;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Check if user is Super Admin.
     */
    protected function ensureSuperAdmin(Request $request)
    {
        $user = $request->user();
        if (!$user || !$user->isSuperAdmin()) {
            abort(403, 'Access denied. Only Super Admins can access this resource.');
        }
    }

    /**
     * Overall platform stats.
     */
    public function stats(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $totalUsers = User::count();
        $activeSubscriptions = User::where('subscription_status', 'active')->count();
        $totalBadges = Badge::count();
        $totalRevenue = Subscription::sum('price');
        $pendingRefunds = RefundRequest::where('status', 'pending')->count();

        $recentUsers = User::withCount('badges')
            ->latest()
            ->take(6)
            ->get();

        $recentRefunds = RefundRequest::with('user:id,name,email')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'active_subscriptions' => $activeSubscriptions,
                'total_badges' => $totalBadges,
                'total_revenue' => round($totalRevenue, 2),
                'pending_refunds' => $pendingRefunds,
            ],
            'recent_users' => $recentUsers,
            'recent_refunds' => $recentRefunds,
        ]);
    }

    /**
     * List all users with badge counts.
     */
    public function users(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $query = User::withCount('badges');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            $query->where('role', $role);
        }

        if ($plan = $request->input('plan')) {
            $query->where('plan', $plan);
        }

        $users = $query->latest()->paginate(25);

        return response()->json($users);
    }

    /**
     * Update user details (role, subscription, limits, status).
     */
    public function updateUser(Request $request, $id)
    {
        $this->ensureSuperAdmin($request);

        $user = User::findOrFail($id);

        $request->validate([
            'role' => 'sometimes|in:user,super_admin',
            'plan' => 'sometimes|string',
            'plan_name' => 'sometimes|string',
            'subscription_status' => 'sometimes|in:active,expired,cancelled',
            'badge_limit' => 'sometimes|integer|min:1',
            'days_to_add' => 'sometimes|integer',
        ]);

        if ($request->has('role')) {
            $user->role = $request->role;
        }
        if ($request->has('plan')) {
            $user->plan = $request->plan;
            if ($request->plan === 'starter') $user->plan_name = 'Starter Plan';
            if ($request->plan === 'pro') $user->plan_name = 'Professional Pass';
            if ($request->plan === 'enterprise') $user->plan_name = 'Enterprise Studio';
        }
        if ($request->has('plan_name')) {
            $user->plan_name = $request->plan_name;
        }
        if ($request->has('subscription_status')) {
            $user->subscription_status = $request->subscription_status;
        }
        if ($request->has('badge_limit')) {
            $user->badge_limit = $request->badge_limit;
        }
        if ($request->filled('days_to_add')) {
            $days = (int) $request->days_to_add;
            $currentEnd = $user->subscription_ends_at ? Carbon::parse($user->subscription_ends_at) : Carbon::now();
            $base = $currentEnd->isFuture() ? $currentEnd : Carbon::now();
            $user->subscription_ends_at = $base->addDays($days);
            $user->subscription_status = 'active';
        }

        $user->save();

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh(['badges']),
        ]);
    }

    /**
     * Delete a user.
     */
    public function deleteUser(Request $request, $id)
    {
        $this->ensureSuperAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete your own super admin account.'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * List all subscriptions across platform.
     */
    public function subscriptions(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $subscriptions = Subscription::with('user:id,name,email')
            ->latest()
            ->paginate(25);

        return response()->json($subscriptions);
    }

    /**
     * List all refund requests.
     */
    public function refunds(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $refunds = RefundRequest::with('user:id,name,email')
            ->latest()
            ->paginate(25);

        return response()->json($refunds);
    }

    /**
     * Approve or reject a refund request.
     */
    public function updateRefundStatus(Request $request, $id)
    {
        $this->ensureSuperAdmin($request);

        $request->validate([
            'status' => 'required|in:approved,rejected,pending',
            'admin_notes' => 'nullable|string',
        ]);

        $refund = RefundRequest::findOrFail($id);
        $refund->status = $request->status;
        if ($request->filled('admin_notes')) {
            $refund->admin_notes = $request->admin_notes;
        }
        $refund->save();

        // If approved, update user subscription status
        if ($request->status === 'approved') {
            $user = $refund->user;
            if ($user) {
                $user->subscription_status = 'cancelled';
                $user->save();
            }
        }

        return response()->json([
            'message' => "Refund marked as {$request->status}",
            'refund' => $refund->fresh('user'),
        ]);
    }

    /**
     * List all badges across platform.
     */
    public function badges(Request $request)
    {
        $this->ensureSuperAdmin($request);

        $badges = Badge::with('user:id,name,email')
            ->latest()
            ->paginate(25);

        return response()->json($badges);
    }
}

