<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrintedInvoicesTable extends Migration
{
    public function up()
    {
        Schema::create('printed_invoices', function (Blueprint $table) {
            $table->id();
            $table->string('number', 30)->nullable(); // Ejemplo: ABC-PI-1
            $table->unsignedBigInteger('invoice_id');
            $table->string('batch_id', 50)->nullable();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();

            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('cascade');
            $table->index('batch_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('printed_invoices');
    }
}