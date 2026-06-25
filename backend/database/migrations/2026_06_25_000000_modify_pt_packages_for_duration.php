<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Hapus data lama karena kita mereset format package
        DB::table('pt_packages')->truncate();

        Schema::table('pt_packages', function (Blueprint $table) {
            $table->dropColumn('sessions');
            $table->string('name')->after('id');
            $table->integer('duration_months')->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('pt_packages', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('duration_months');
            $table->integer('sessions');
        });
    }
};
