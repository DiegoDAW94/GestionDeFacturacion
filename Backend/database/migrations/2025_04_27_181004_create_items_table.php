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
        Schema::create('items', function (Blueprint $table) {
            $table->id(); // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->unsignedBigInteger('company_id'); // Relación con la empresa
            $table->string('name', 255); // Nombre del ítem
            $table->text('description')->nullable(); // Descripción del ítem
            $table->decimal('price', 10, 2); // Precio unitario
            $table->timestamps(); // created_at y updated_at

            // Foreign key
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};