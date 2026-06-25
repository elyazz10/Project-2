<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('trainer_sessions');
            $table->date('trainer_subscription_end_date')->nullable()->after('role');
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('trainer_sessions');
            $table->date('trainer_end_date')->nullable()->after('trainer_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('trainer_subscription_end_date');
            $table->integer('trainer_sessions')->default(0);
        });

        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('trainer_end_date');
            $table->integer('trainer_sessions')->default(0);
        });
    }
};
