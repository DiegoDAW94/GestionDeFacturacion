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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id(); // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->unsignedBigInteger('company_id'); // Relación con la empresa
            $table->unsignedBigInteger('user_id'); // Relación con el usuario que crea la factura
            $table->unsignedBigInteger('client_id'); // Relación con el cliente
            $table->string('number', 20); // Número único de la factura
            $table->date('date'); // Fecha de emisión de la factura
            $table->date('operation_date')->nullable(); // Fecha de la operación (opcional)
            $table->json('custom_items')->nullable(); // Ítems específicos de la factura (opcional)
            $table->decimal('base_amount', 10, 2); // Base imponible
            $table->decimal('tax_amount', 10, 2); // Cuota tributaria
            $table->decimal('total', 10, 2); // Total a pagar
            $table->timestamps(); // created_at y updated_at

            // Foreign keys
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};