<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanDay extends Model
{
    /** @use HasFactory<\Database\Factories\PlanDayFactory> */
    use HasFactory;

    protected $fillable = [
        'day_number',
        'date',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    // プラン詳細のリレーション
    public function planDetails()
    {
        return $this->hasMany(PlanDetail::class);
    }
}
