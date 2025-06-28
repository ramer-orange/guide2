<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    /** @use HasFactory<\Database\Factories\PlanFactory> */
    use HasFactory;

    /**
     * 複数代入可能な属性
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'start_date',
        'end_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function planDetails()
    {
        return $this->hasMany(PlanDetail::class);
    }
}
