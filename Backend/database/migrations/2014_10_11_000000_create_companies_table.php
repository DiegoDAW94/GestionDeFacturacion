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
        Schema::create('companies', function (Blueprint $table) {
            $table->id(); // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->string('name', 255); // Nombre de la empresa
            $table->string('legal_name', 255)->nullable(); // Nombre legal de la empresa (opcional)
            $table->string('cif', 50)->nullable(); // CIF de la empresa (opcional)
            $table->text('fiscal_address')->nullable(); // Dirección fiscal
            $table->text('social_address')->nullable(); // Dirección social (opcional)
            $table->string('city', 100)->nullable(); // Ciudad
            $table->string('postal_code', 10)->nullable(); // Código postal
            $table->string('province', 100)->nullable(); // Provincia
            $table->string('email', 255)->nullable(); // Email de la empresa (opcional)
            $table->string('telefono', 20)->nullable(); // Teléfono de la empresa (opcional)
            $table->string('invoice_prefix', 10)->nullable(); // Prefijo para las facturas (opcional)
            $table->timestamps(); // created_at y updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};