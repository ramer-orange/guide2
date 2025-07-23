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
        Schema::create('plan_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->integer('day_number')->comment('何日目か');
            $table->string('title')->nullable()->comment('タイトル');
            $table->integer('type')->nullable()->comment('プランタイプ: メモ、スポット、移動等');
            $table->text('memo')->nullable()->comment('メモ');
            $table->time('arrival_time')->nullable()->comment('到着時間');
            $table->integer('order')->nullable()->comment('表示順');
            $table->string('place_id')->nullable()->comment('Google PlaceID');
            $table->decimal('latitude', 10, 8)->nullable()->comment('緯度');
            $table->decimal('longitude', 11, 8)->nullable()->comment('経度');
            $table->string('address')->nullable()->comment('住所');
            $table->decimal('rating', 2, 1)->nullable()->comment('評価');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_details');
    }
};
