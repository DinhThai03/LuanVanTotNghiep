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
        Schema::create('credit_prices', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->id();
            $table->enum('subject_type', ['LT', 'TH'])->notNullable();
            $table->decimal('price_per_credit', 10, 2)->notNullable();
            $table->boolean('is_active')->notNullable();
            $table->integer('year')->notNullable();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_prices');
    }
};
