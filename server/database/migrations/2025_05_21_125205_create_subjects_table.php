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
        Schema::create('subjects', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->char('code', 10)->notNullable();
            $table->string('name', 100)->notNullable();
            $table->integer('credit')->notNullable();
            $table->integer('tuition_credit')->notNullable();
            $table->decimal('midterm_percent', 5, 2)->notNullable();
            $table->decimal('process_percent', 5, 2)->notNullable();
            $table->decimal('final_percent', 5, 2)->notNullable();
            $table->integer('year')->notNullable();
            $table->enum('subject_type', ['LT', 'TH', 'DA', 'KL']);
            $table->boolean('is_optional')->default(false);
            $table->string('file_path')->nullable();
            $table->boolean('is_active')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
