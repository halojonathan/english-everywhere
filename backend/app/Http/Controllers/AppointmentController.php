<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AppointmentSchedule;
use App\Models\AppointmentBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends Controller
{
    /**
     * Get all appointment schedules.
     */
    public function getSchedules(Request $request)
    {
        $schedules = AppointmentSchedule::orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $schedules
        ]);
    }

    /**
     * Create or update an appointment schedule slot.
     */
    public function createSchedule(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|string',
            'quota' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $date = $request->input('date');
        $time = $request->input('time');
        $quota = $request->input('quota');

        // Update quota if slot exists, otherwise create it
        $schedule = AppointmentSchedule::updateOrCreate(
            ['date' => $date, 'time' => $time],
            ['quota' => $quota]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule created/updated successfully.',
            'data' => $schedule
        ]);
    }

    /**
     * Delete an appointment schedule slot.
     */
    public function deleteSchedule($id)
    {
        $schedule = AppointmentSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'status' => 'error',
                'message' => 'Schedule slot not found.'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule slot deleted successfully.'
        ]);
    }

    /**
     * Book a placement test appointment.
     */
    public function bookAppointment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'schedule_id' => 'required|exists:appointment_schedules,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'gender' => 'nullable|string|max:20',
            'program' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $scheduleId = $request->input('schedule_id');
        $name = $request->input('name');
        $email = $request->input('email');
        $phone = $request->input('phone');
        $gender = $request->input('gender');
        $program = $request->input('program');

        try {
            $booking = DB::transaction(function () use ($scheduleId, $name, $email, $phone, $gender, $program) {
                // Lock the schedule row to prevent race conditions
                $schedule = AppointmentSchedule::lockForUpdate()->find($scheduleId);

                if (!$schedule->hasAvailableQuota()) {
                    throw new \Exception('Kuota untuk jadwal ini sudah penuh.');
                }

                $booking = AppointmentBooking::create([
                    'schedule_id' => $scheduleId,
                    'name' => $name,
                    'email' => $email,
                    'phone' => $phone,
                    'gender' => $gender,
                    'program' => $program,
                    'status' => 'pending'
                ]);

                // Increment booked count
                $schedule->increment('booked');

                return $booking;
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Pendaftaran jadwal test berhasil.',
                'data' => $booking
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * Accept a student booking, assign them a program, and create a user account.
     */
    public function acceptBooking(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'assigned_program' => 'required|string|max:255',
            'gender' => 'nullable|string|max:20',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:4',
            'username' => 'nullable|string|max:255',
            'dob' => 'nullable|string|max:255',
            'status' => 'nullable|string|max:255',
            'alamat' => 'nullable|string',
            'photo' => 'nullable|string',
            'program_series' => 'nullable|string|max:255',
            'guardian_name' => 'nullable|string|max:255',
            'specific_level' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $booking = AppointmentBooking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking data not found.'
            ], 404);
        }

        try {
            DB::transaction(function () use ($booking, $request) {
                $booking->status = 'accepted';
                $booking->assigned_program = $request->input('assigned_program');
                
                if ($request->has('name')) {
                    $booking->name = $request->input('name');
                }
                if ($request->has('email')) {
                    $booking->email = $request->input('email');
                }
                if ($request->has('phone')) {
                    $booking->phone = $request->input('phone');
                }
                if ($request->has('gender')) {
                    $booking->gender = $request->input('gender');
                }
                $booking->save();

                $password = $request->input('password') ?: 'murid123';
                $username = $request->input('username') ?: ($booking->email ? explode('@', $booking->email)[0] : strtolower(str_replace(' ', '', $booking->name)));
                $gender = $request->input('gender') ?: $booking->gender;

                // Create student account
                User::updateOrCreate(
                    ['email' => $booking->email],
                    [
                        'name' => $booking->name,
                        'password' => bcrypt($password),
                        'plain_password' => $password,
                        'role' => 'student',
                        'program_series' => $request->input('program_series') ?: $booking->assigned_program,
                        'username' => $username,
                        'dob' => $request->input('dob') ?: '-',
                        'status' => $request->input('status') ?: 'Active',
                        'gender' => $gender === 'Male' ? 'Male' : ($gender === 'Female' ? 'Female' : ($gender === 'Laki-laki' ? 'Male' : ($gender === 'Perempuan' ? 'Female' : $gender))),
                        'alamat' => $request->input('alamat'),
                        'phone' => $booking->phone,
                        'photo' => $request->input('photo'),
                        'guardian_name' => $request->input('guardian_name'),
                        'specific_level' => $request->input('specific_level') ?: $booking->assigned_program,
                    ]
                );

            });

            return response()->json([
                'status' => 'success',
                'message' => 'Booking accepted and student account created.',
                'data' => $booking
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete/cancel a booking.
     */
    public function deleteBooking($id)
    {
        $booking = AppointmentBooking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking data not found.'
            ], 404);
        }

        try {
            DB::transaction(function () use ($booking) {
                // If the booking was pending/not accepted, release the booked quota slot
                if ($booking->status !== 'accepted') {
                    $schedule = AppointmentSchedule::find($booking->schedule_id);
                    if ($schedule && $schedule->booked > 0) {
                        $schedule->decrement('booked');
                    }
                }
                $booking->delete();
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Booking deleted successfully.'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get bookings list (for admin).
     */
    public function getBookings(Request $request)
    {
        $query = AppointmentBooking::with('schedule')
            ->orderBy('created_at', 'desc');

        if ($request->has('date')) {
            $date = $request->input('date');
            $query->whereHas('schedule', function ($q) use ($date) {
                $q->where('date', $date);
            });
        }

        $bookings = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $bookings
        ]);
    }
}
