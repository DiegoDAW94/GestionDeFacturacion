<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id(); // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 255); // Nombre del cliente
            $table->string('nif', 50)->nullable(); // NIF del cliente (opcional)
            $table->text('fiscal_address'); // Dirección fiscal
            $table->string('city', 100); // Ciudad
            $table->string('postal_code', 10); // Código postal
            $table->string('province', 100); // Provincia
            $table->string('email', 255)->nullable(); // Email del cliente (opcional)
            $table->unsignedBigInteger('company_id'); // Relación con la empresa
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};