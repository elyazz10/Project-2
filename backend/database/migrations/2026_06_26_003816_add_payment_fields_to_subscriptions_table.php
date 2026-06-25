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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('order_id')->nullable()->after('end_date');
            $table->decimal('gross_amount', 12, 2)->nullable()->after('order_id');
            $table->decimal('trainer_fee', 12, 2)->nullable()->after('gross_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn(['order_id', 'gross_amount', 'trainer_fee']);
        });
    }
};
