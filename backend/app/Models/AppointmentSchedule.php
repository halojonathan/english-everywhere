<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AppointmentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time',
        'quota',
        'booked',
    ];

    /**
     * Get the bookings for this schedule.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(AppointmentBooking::class, 'schedule_id');
    }

    /**
     * Check if the schedule has available slots.
     */
    public function hasAvailableQuota(): bool
    {
        return $this->booked < $this->quota;
    }
}
