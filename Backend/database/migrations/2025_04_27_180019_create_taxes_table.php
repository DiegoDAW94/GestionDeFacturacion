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
        Schema::create('taxes', function (Blueprint $table) {
            $table->id(); // id INT NOT NULL AUTO_INCREMENT PRIMARY KEY
            $table->unsignedBigInteger('company_id'); // Relación con la empresa
            $table->string('name', 50); // Nombre del impuesto (por ejemplo, IVA)
            $table->decimal('percentage', 5, 2); // Porcentaje del impuesto
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
        Schema::dropIfExists('taxes');
    }
};