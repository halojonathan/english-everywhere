<?php

namespace App\Http\Controllers;

use App\Models\ClassSession;
use App\Models\AttendanceRecord;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassSessionController extends Controller
{
    /**
     * Get list of class sessions (teacher schedules).
     */
    public function index()
    {
        $sessions = ClassSession::with('teacher')->orderBy('date', 'asc')->orderBy('start_time', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $sessions
        ]);
    }

    /**
     * Store a new class session schedule.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:users,id',
            'program_series' => 'required|string|max:255',
            'specific_level' => 'nullable|string|max:255',
            'classroom' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $session = ClassSession::create([
            'teacher_id' => $request->input('teacher_id'),
            'program_series' => $request->input('program_series'),
            'specific_level' => $request->input('specific_level'),
            'classroom' => $request->input('classroom'),
            'date' => $request->input('date'),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
        ]);

        $session->load('teacher');

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule created successfully.',
            'data' => $session
        ]);
    }

    /**
     * Remove a class session.
     */
    public function destroy($id)
    {
        $session = ClassSession::find($id);

        if (!$session) {
            return response()->json([
                'status' => 'error',
                'message' => 'Schedule not found.'
            ], 404);
        }

        $session->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule deleted successfully.'
        ]);
    }

    /**
     * Get students and attendance details for a specific class session.
     */
    public function getAttendance($sessionId)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return response()->json([
                'status' => 'error',
                'message' => 'Class session not found.'
            ], 404);
        }

        // Query students who belong to the same program and level
        $students = User::where('role', 'student')
            ->where('program_series', $session->program_series)
            ->when($session->specific_level, function($q) use ($session) {
                return $q->where('specific_level', $session->specific_level);
            })
            ->orderBy('name', 'asc')
            ->get();

        $records = AttendanceRecord::where('class_session_id', $sessionId)->get()->keyBy('student_id');

        $data = $students->map(function($student) use ($records) {
            return [
                'id' => $student->id,
                'name' => $student->name,
                'status' => isset($records[$student->id]) ? $records[$student->id]->status : null,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'session' => $session->load('teacher'),
                'students' => $data
            ]
        ]);
    }

    /**
     * Save/update student attendance for a class session.
     */
    public function saveAttendance(Request $request, $sessionId)
    {
        $session = ClassSession::find($sessionId);
        if (!$session) {
            return response()->json([
                'status' => 'error',
                'message' => 'Class session not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:users,id',
            'attendance.*.status' => 'required|in:H,A,I',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        foreach ($request->input('attendance') as $item) {
            AttendanceRecord::updateOrCreate(
                [
                    'class_session_id' => $sessionId,
                    'student_id' => $item['student_id'],
                ],
                [
                    'status' => $item['status'],
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Attendance saved successfully.'
        ]);
    }

    /**
     * Update an existing class session schedule.
     */
    public function update(Request $request, $id)
    {
        $session = ClassSession::find($id);

        if (!$session) {
            return response()->json([
                'status' => 'error',
                'message' => 'Schedule not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'teacher_id' => 'required|exists:users,id',
            'program_series' => 'required|string|max:255',
            'specific_level' => 'nullable|string|max:255',
            'classroom' => 'required|string|max:255',
            'date' => 'required|date_format:Y-m-d',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $session->update([
            'teacher_id' => $request->input('teacher_id'),
            'program_series' => $request->input('program_series'),
            'specific_level' => $request->input('specific_level'),
            'classroom' => $request->input('classroom'),
            'date' => $request->input('date'),
            'start_time' => $request->input('start_time'),
            'end_time' => $request->input('end_time'),
        ]);

        $session->load('teacher');

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule updated successfully.',
            'data' => $session
        ]);
    }

    /**
     * Get attendance recap for admin dashboard.
     */
    public function getAttendanceRecap()
    {
        $sessions = ClassSession::with('teacher')->orderBy('date', 'desc')->orderBy('start_time', 'desc')->get();

        $data = $sessions->map(function($session) {
            // Find enrolled students count
            $enrolledCount = User::where('role', 'student')
                ->where('program_series', $session->program_series)
                ->when($session->specific_level, function($q) use ($session) {
                    return $q->where('specific_level', $session->specific_level);
                })
                ->count();

            // Count H, A, I
            $hadirCount = AttendanceRecord::where('class_session_id', $session->id)->where('status', 'H')->count();
            $alphaCount = AttendanceRecord::where('class_session_id', $session->id)->where('status', 'A')->count();
            $izinCount  = AttendanceRecord::where('class_session_id', $session->id)->where('status', 'I')->count();

            return [
                'id' => $session->id,
                'teacher_name' => $session->teacher->name ?? 'N/A',
                'program_series' => $session->program_series,
                'specific_level' => $session->specific_level,
                'classroom' => $session->classroom,
                'date' => $session->date,
                'start_time' => substr($session->start_time, 0, 5),
                'end_time' => substr($session->end_time, 0, 5),
                'total_students' => $enrolledCount,
                'jumlah_hadir' => $hadirCount,
                'jumlah_alpha' => $alphaCount,
                'jumlah_izin' => $izinCount,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
