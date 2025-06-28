<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanDetail extends Model
{
    /** @use HasFactory<\Database\Factories\PlanDetailFactory> */
    use HasFactory;

    protected $fillable = [
        'plan_id',
        'day_number',
        'type',
        'title',
        'memo',
        'arrival_time',
        'order',
    ];

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
