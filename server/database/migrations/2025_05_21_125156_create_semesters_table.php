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
        Schema::create('semesters', function (Blueprint $table) {
            $table->engine = 'InnoDB';
        
            $table->id();
            $table->string('name', 100)->notNullable();
            $table->date('start_date')->notNullable();
            $table->date('end_date')->notNullable();
            $table->unsignedBigInteger('academic_year_id')->notNullable();

            $table->foreign('academic_year_id')->references('id')->on('academic_years');

            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};
