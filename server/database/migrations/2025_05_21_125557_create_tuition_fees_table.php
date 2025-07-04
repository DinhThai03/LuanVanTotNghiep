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
        Schema::create('tuition_fees', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->id();
            $table->unsignedBigInteger('registration_id')->notNullable();
            $table->decimal('amount', 10, 2)->notNullable();
            $table->dateTime('paid_at')->nullable();
            $table->string('payment_method', 50)->nullable();
            $table->string('payment_status', 20)->nullable(); // pending, success, failed
            $table->string('transaction_id', 100)->nullable();

            $table->foreign('registration_id')->references('id')->on('registrations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tuition_fees');
    }
};
