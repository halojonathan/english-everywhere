<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\PaymentController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/status', function () {
    return response()->json([
        'status' => 'online',
        'message' => 'Laravel backend connected successfully!',
        'database' => config('database.default'),
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    $username = $credentials['username'];
    $password = $credentials['password'];

    // 1. Try Database authentication
    try {
        $user = User::where('username', $username)->orWhere('email', $username)->first();
        if ($user && Hash::check($password, $user->password)) {
            return response()->json([
                'status' => 'success',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ]);
        }
    } catch (\Exception $e) {
        // Fallback silently if DB is not set up
    }

    // 2. Hardcoded fallback authentication
    $fallbackUsers = [
        'admin' => ['password' => 'admin123', 'name' => 'System Administrator', 'role' => 'admin'],
        'teacher' => ['password' => 'guru123', 'name' => 'English Teacher', 'role' => 'teacher'],
        'student' => ['password' => 'murid123', 'name' => 'Active Student', 'role' => 'student'],
    ];

    if (isset($fallbackUsers[$username]) && $fallbackUsers[$username]['password'] === $password) {
        $fallback = $fallbackUsers[$username];
        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => 999,
                'name' => $fallback['name'],
                'email' => $username,
                'role' => $fallback['role'],
            ],
        ]);
    }

    return response()->json([
        'status' => 'error',
        'message' => 'Username atau password salah.',
    ], 401);
});

// Appointment Routes
Route::get('/appointments/schedules', [AppointmentController::class, 'getSchedules']);
Route::post('/appointments/schedules', [AppointmentController::class, 'createSchedule']);
Route::delete('/appointments/schedules/{id}', [AppointmentController::class, 'deleteSchedule']);
Route::post('/appointments/book', [AppointmentController::class, 'bookAppointment']);
Route::get('/appointments/bookings', [AppointmentController::class, 'getBookings']);
Route::post('/appointments/bookings/{id}/accept', [AppointmentController::class, 'acceptBooking']);
Route::delete('/appointments/bookings/{id}', [AppointmentController::class, 'deleteBooking']);

// Learning Materials Routes
Route::get('/learning-materials', [LearningMaterialController::class, 'index']);
Route::post('/learning-materials', [LearningMaterialController::class, 'store']);
Route::put('/learning-materials/{id}', [LearningMaterialController::class, 'update']);
Route::delete('/learning-materials/{id}', [LearningMaterialController::class, 'destroy']);

// User / Account Routes
Route::get('/users', function () {
    return response()->json([
        'status' => 'success',
        'data' => App\Models\User::orderBy('created_at', 'desc')->get()
    ]);
});

Route::post('/users', function (Illuminate\Http\Request $request) {
    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|unique:users,email',
        'username' => 'nullable|string|max:255',
        'dob' => 'nullable|string|max:255',
        'status' => 'nullable|string|max:255',
        'role' => 'required|string|max:255',
        'gender' => 'nullable|string|max:255',
        'alamat' => 'nullable|string',
        'phone' => 'nullable|string|max:255',
        'password' => 'nullable|string|min:4',
        'photo' => 'nullable|string',
        'program_series' => 'nullable|string|max:255',
        'guardian_name' => 'nullable|string|max:255',
        'specific_level' => 'nullable|string|max:255',
        'entry_date' => 'nullable|string|max:255',
        'test_date' => 'nullable|string|max:255',
        'exit_date' => 'nullable|string|max:255',
    ]);

    $rawPassword = $data['password'] ?? 'murid123';

    $user = App\Models\User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'username' => $data['username'] ?? $data['email'],
        'dob' => $data['dob'] ?? '-',
        'status' => $data['status'] ?? 'Active',
        'role' => $data['role'],
        'gender' => $data['gender'] ?? null,
        'alamat' => $data['alamat'] ?? null,
        'phone' => $data['phone'] ?? null,
        'password' => Illuminate\Support\Facades\Hash::make($rawPassword),
        'plain_password' => $rawPassword,
        'photo' => $data['photo'] ?? null,
        'program_series' => $data['program_series'] ?? null,
        'guardian_name' => $data['guardian_name'] ?? null,
        'specific_level' => $data['specific_level'] ?? null,
        'entry_date' => $data['entry_date'] ?? null,
        'test_date' => $data['test_date'] ?? null,
        'exit_date' => $data['exit_date'] ?? null,
    ]);

    return response()->json([
        'status' => 'success',
        'data' => $user
    ]);
});

Route::put('/users/{id}', function (Illuminate\Http\Request $request, $id) {
    $user = App\Models\User::find($id);
    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|unique:users,email,' . $id,
        'username' => 'nullable|string|max:255',
        'dob' => 'nullable|string|max:255',
        'status' => 'nullable|string|max:255',
        'role' => 'required|string|max:255',
        'gender' => 'nullable|string|max:255',
        'alamat' => 'nullable|string',
        'phone' => 'nullable|string|max:255',
        'password' => 'nullable|string|min:4',
        'photo' => 'nullable|string',
        'program_series' => 'nullable|string|max:255',
        'guardian_name' => 'nullable|string|max:255',
        'specific_level' => 'nullable|string|max:255',
        'entry_date' => 'nullable|string|max:255',
        'test_date' => 'nullable|string|max:255',
        'exit_date' => 'nullable|string|max:255',
    ]);

    $updateData = [
        'name' => $data['name'],
        'email' => $data['email'],
        'username' => $data['username'] ?? $data['email'],
        'dob' => $data['dob'] ?? '-',
        'status' => $data['status'] ?? 'Active',
        'role' => $data['role'],
        'gender' => $data['gender'] ?? null,
        'alamat' => $data['alamat'] ?? null,
        'phone' => $data['phone'] ?? null,
        'photo' => $data['photo'] ?? $user->photo,
        'program_series' => $data['program_series'] ?? $user->program_series,
        'guardian_name' => $data['guardian_name'] ?? $user->guardian_name,
        'specific_level' => $data['specific_level'] ?? $user->specific_level,
        'entry_date' => $data['entry_date'] ?? $user->entry_date,
        'test_date' => $data['test_date'] ?? $user->test_date,
        'exit_date' => $data['exit_date'] ?? $user->exit_date,
    ];

    if (!empty($data['password'])) {
        $updateData['password'] = Illuminate\Support\Facades\Hash::make($data['password']);
        $updateData['plain_password'] = $data['password'];
    }

    $user->update($updateData);

    return response()->json([
        'status' => 'success',
        'data' => $user
    ]);
});

Route::delete('/users/{id}', function ($id) {
    $user = App\Models\User::find($id);
    if (!$user) {
        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }
    $user->delete();
    return response()->json([
        'status' => 'success',
        'message' => 'User deleted successfully'
    ]);
});

Route::get('/students/{id}/overview', function ($id) {
    $user = App\Models\User::find($id);
    if (!$user || strtolower($user->role) !== 'student') {
        return response()->json(['status' => 'error', 'message' => 'Student not found'], 404);
    }

    // Resolve Entry, Test, and Exit Dates
    $entryDate = $user->entry_date ?: ($user->created_at ? $user->created_at->format('d/m/Y') : '-');
    
    $testDate = $user->test_date;
    if (!$testDate) {
        $booking = App\Models\AppointmentBooking::with('schedule')
            ->where('email', $user->email)
            ->orWhere('phone', $user->phone)
            ->first();
        if ($booking && $booking->schedule) {
            $testDate = $booking->schedule->date; // YYYY-MM-DD
            $parts = explode('-', $testDate);
            if (count($parts) === 3) {
                $testDate = "{$parts[2]}/{$parts[1]}/{$parts[0]}";
            }
        } else {
            $testDate = '-';
        }
    }

    $exitDate = $user->exit_date;
    if (!$exitDate && strtolower($user->status) === 'inactive') {
        $exitDate = $user->updated_at ? $user->updated_at->format('d/m/Y') : '-';
    }
    if (!$exitDate) {
        $exitDate = '-';
    }

    // Fetch Payments
    $payments = App\Models\Payment::where('student_id', $id)
        ->orWhere('student_name', $user->name)
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function($p) {
            return [
                'id' => $p->id,
                'transaction_id' => $p->transaction_id,
                'invoice_no' => $p->invoice_no,
                'bill_date' => $p->bill_date,
                'course_name' => $p->course_name,
                'subtotal' => $p->subtotal,
                'payment_method' => $p->payment_method,
                'status' => $p->status,
                'created_at' => $p->created_at ? $p->created_at->toIso8601String() : null
            ];
        });

    // Fetch Attendance
    $attendanceRecords = App\Models\AttendanceRecord::where('student_id', $id)->get()->keyBy('class_session_id');

    // Fetch Class Sessions
    $classSessions = App\Models\ClassSession::with('teacher')
        ->where(function($q) use ($user, $attendanceRecords) {
            $q->where(function($sub) use ($user) {
                $sub->where('program_series', $user->program_series)
                    ->when($user->specific_level, function($sq) use ($user) {
                        return $sq->where('specific_level', $user->specific_level);
                    });
            })
            ->orWhereIn('id', $attendanceRecords->keys()->toArray());
        })
        ->orderBy('date', 'desc')
        ->orderBy('start_time', 'desc')
        ->get()
        ->map(function($session) use ($attendanceRecords) {
            $record = $attendanceRecords->get($session->id);
            $status = $record ? $record->status : null; // H, A, I or null
            return [
                'id' => $session->id,
                'date' => $session->date,
                'start_time' => $session->start_time,
                'end_time' => $session->end_time,
                'classroom' => $session->classroom,
                'program_series' => $session->program_series,
                'specific_level' => $session->specific_level,
                'teacher_name' => $session->teacher->name ?? 'N/A',
                'attendance_status' => $status
            ];
        });

    return response()->json([
        'status' => 'success',
        'data' => [
            'student' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username,
                'phone' => $user->phone,
                'dob' => $user->dob,
                'gender' => $user->gender,
                'alamat' => $user->alamat,
                'photo' => $user->photo,
                'status' => $user->status,
                'program_series' => $user->program_series,
                'specific_level' => $user->specific_level,
                'guardian_name' => $user->guardian_name,
                'entry_date' => $entryDate,
                'test_date' => $testDate,
                'exit_date' => $exitDate
            ],
            'payments' => $payments,
            'classes' => $classSessions
        ]
    ]);
});

// Payments Routes
Route::get('/payments', [PaymentController::class, 'index']);
Route::post('/payments', [PaymentController::class, 'store']);
Route::put('/payments/{id}', [PaymentController::class, 'update']);
Route::delete('/payments/{id}', [PaymentController::class, 'destroy']);

// Custom Transaction Flow Routes (Virtual Account, QRIS, Webhook, Lunas Manual)
Route::post('/payments/{id}/pay', function (Request $request, $id) {
    $payment = App\Models\Payment::find($id);
    if (!$payment) {
        return response()->json(['status' => 'error', 'message' => 'Tagihan tidak ditemukan'], 404);
    }

    $method = $request->input('method'); // virtual_account, qris, manual_transfer, cash
    $installmentIdx = $request->input('installment_idx', 0);
    $amount = $request->input('amount');

    if ($method === 'virtual_account') {
        $vaNumber = '988' . rand(10000000, 99999999);
        $payment->update([
            'status' => 'Pending (VA)',
            'payment_method' => 'Virtual Account',
            'payment_proof' => $vaNumber,
        ]);
    } else if ($method === 'qris') {
        $qrisUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EnglishEverywherePaymentInvoice' . $payment->invoice_no;
        $payment->update([
            'status' => 'Pending (QRIS)',
            'payment_method' => 'QRIS',
            'payment_proof' => $qrisUrl,
        ]);
    } else if ($method === 'manual_transfer') {
        $paymentProof = $request->input('payment_proof');
        $payment->update([
            'status' => 'Verifying',
            'payment_method' => 'Manual Transfer',
            'payment_proof' => $paymentProof,
        ]);
    } else if ($method === 'cash') {
        $payment->update([
            'status' => 'Pending (Cash)',
            'payment_method' => 'Cash',
            'payment_proof' => 'Bayar Tunai di Tempat Les',
        ]);
    }

    return response()->json([
        'status' => 'success',
        'data' => $payment
    ]);
});

Route::post('/payments/{id}/lunas-manual', function ($id) {
    $payment = App\Models\Payment::find($id);
    if (!$payment) {
        return response()->json(['status' => 'error', 'message' => 'Tagihan tidak ditemukan'], 404);
    }

    $payment->update([
        'status' => 'Paid',
        'payment_method' => 'Cash',
        'payment_proof' => 'Lunas Manual oleh Admin',
    ]);

    return response()->json([
        'status' => 'success',
        'message' => 'Tagihan berhasil dilunasi secara manual.',
        'data' => $payment
    ]);
});

Route::post('/payments/webhook', function (Request $request) {
    $externalId = $request->input('external_id') ?? $request->input('order_id');
    $status = $request->input('status') ?? $request->input('transaction_status');

    if (!$externalId) {
        return response()->json(['status' => 'error', 'message' => 'Missing ID'], 400);
    }

    $payment = App\Models\Payment::where('transaction_id', $externalId)
        ->orWhere('invoice_no', $externalId)
        ->first();

    if (!$payment) {
        return response()->json(['status' => 'error', 'message' => 'Payment not found'], 404);
    }

    if (in_array(strtolower($status), ['completed', 'settlement', 'success'])) {
        $payment->update([
            'status' => 'Paid',
            'payment_method' => $payment->payment_method ?? 'Virtual Account',
        ]);
        return response()->json(['status' => 'success', 'message' => 'Payment status updated to Paid']);
    }

    return response()->json(['status' => 'success', 'message' => 'Webhook received, no action taken']);
});

// Articles Routes (English Corner)
use App\Http\Controllers\ArticleController;
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/{id}', [ArticleController::class, 'show']);
Route::post('/articles', [ArticleController::class, 'store']);
Route::put('/articles/{id}', [ArticleController::class, 'update']);
Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);

// Events Routes
use App\Http\Controllers\EventController;
Route::get('/events', [EventController::class, 'index']);
Route::post('/events', [EventController::class, 'store']);
Route::put('/events/{id}', [EventController::class, 'update']);
Route::delete('/events/{id}', [EventController::class, 'destroy']);

// Class Sessions & Attendance Routes
use App\Http\Controllers\ClassSessionController;
Route::get('/class-sessions', [ClassSessionController::class, 'index']);
Route::post('/class-sessions', [ClassSessionController::class, 'store']);
Route::put('/class-sessions/{id}', [ClassSessionController::class, 'update']);
Route::delete('/class-sessions/{id}', [ClassSessionController::class, 'destroy']);
Route::get('/class-sessions/{id}/attendance', [ClassSessionController::class, 'getAttendance']);
Route::post('/class-sessions/{id}/attendance', [ClassSessionController::class, 'saveAttendance']);
Route::get('/attendance-recap', [ClassSessionController::class, 'getAttendanceRecap']);
Route::get('/class-sessions/attendance/recap', [ClassSessionController::class, 'getAttendanceRecap']);


