<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('password');
            }
            if (!Schema::hasColumn('users', 'plan')) {
                $table->string('plan')->default('starter')->after('role');
            }
            if (!Schema::hasColumn('users', 'plan_name')) {
                $table->string('plan_name')->default('Starter Plan')->after('plan');
            }
            if (!Schema::hasColumn('users', 'subscription_status')) {
                $table->string('subscription_status')->default('active')->after('plan_name');
            }
            if (!Schema::hasColumn('users', 'subscription_ends_at')) {
                $table->timestamp('subscription_ends_at')->nullable()->after('subscription_status');
            }
            if (!Schema::hasColumn('users', 'badge_limit')) {
                $table->integer('badge_limit')->default(25)->after('subscription_ends_at');
            }
            if (!Schema::hasColumn('users', 'billing_cycle')) {
                $table->string('billing_cycle')->default('monthly')->after('badge_limit');
            }
        });

        if (!Schema::hasTable('subscriptions')) {
            Schema::create('subscriptions', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
                $table->string('plan');
                $table->string('plan_name');
                $table->decimal('price', 10, 2)->default(0.00);
                $table->string('billing_cycle')->default('monthly');
                $table->string('status')->default('active'); // active, expired, upgraded, cancelled
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('ends_at')->nullable();
                $table->string('payment_method')->nullable();
                $table->string('transaction_id')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('refund_requests')) {
            Schema::create('refund_requests', function (Blueprint $table) {
                $table->uuid('id')->primary();
                $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
                $table->foreignUuid('subscription_id')->nullable()->constrained('subscriptions')->nullOnDelete();
                $table->decimal('amount', 10, 2);
                $table->text('reason');
                $table->string('status')->default('pending'); // pending, approved, rejected
                $table->text('admin_notes')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refund_requests');
        Schema::dropIfExists('subscriptions');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'plan',
                'plan_name',
                'subscription_status',
                'subscription_ends_at',
                'badge_limit',
                'billing_cycle',
            ]);
        });
    }
};
