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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_id');
            $table->string('invoice_no');
            $table->string('bill_date');
            $table->unsignedBigInteger('student_id')->nullable();
            $table->string('student_name');
            $table->string('course_name');
            $table->integer('class_fee');
            $table->integer('discount');
            $table->integer('subtotal');
            $table->integer('num_installments');
            $table->text('installments'); // JSON structure storing installment dates & amounts
            $table->string('payment_proof')->nullable();
            $table->string('status')->default('Pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
