<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'name',
        'email',
        'phone',
        'gender',
        'program',
        'assigned_program',
        'status',
    ];

    /**
     * Get the schedule that owns the booking.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(AppointmentSchedule::class, 'schedule_id');
    }
}
