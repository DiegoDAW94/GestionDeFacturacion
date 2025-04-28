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
        Schema::create('user_roles', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); // user_id INT NOT NULL
            $table->unsignedBigInteger('role_id'); // role_id INT NOT NULL
            $table->unsignedBigInteger('company_id'); // company_id INT NOT NULL
            $table->timestamps(); // Agregar created_at y updated_at

            $table->primary(['user_id', 'role_id', 'company_id']); // PRIMARY KEY (user_id, role_id, company_id)

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_roles');
    }
};