<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Background scheduler running daily to scan unpaid bills and send H-3 warnings via SMTP / SMS simulation
Schedule::call(function () {
    Log::info('Daily payment reminder check started.');
    
    // Find all payments where status is not Paid/Lunas
    $payments = Payment::whereNotIn('status', ['Paid', 'Lunas'])->get();

    foreach ($payments as $payment) {
        $installments = $payment->installments;
        if (is_array($installments)) {
            foreach ($installments as $idx => $inst) {
                if (isset($inst['deadline']) && isset($inst['amount'])) {
                    // Check if deadline is 3 days from now (H-3)
                    $deadline = \Carbon\Carbon::parse($inst['deadline']);
                    $diffInDays = \Carbon\Carbon::today()->diffInDays($deadline, false);
                    
                    // H-3 warning
                    if ($diffInDays === 3) {
                        $nominal = number_format($inst['amount'], 0, ',', '.');
                        $dueStr = $deadline->format('d M Y');
                        
                        $msg = "PENGINGAT PEMBAYARAN: Halo {$payment->student_name}, tagihan untuk program {$payment->course_name} (Cicilan ke-" . ($idx + 1) . ") sebesar Rp {$nominal} akan jatuh tempo pada {$dueStr}. Harap segera melakukan pembayaran via portal.";
                        
                        // Log locally (WhatsApp API / Log simulation)
                        Log::info("[WhatsApp API Gateway Target: {$payment->phone}] Message: {$msg}");
                        
                        // Send Email via SMTP
                        try {
                            Mail::raw($msg, function ($message) use ($payment) {
                                $message->to('student@english-everywhere.com')
                                    ->subject('Pengingat Batas Waktu Pembayaran (H-3)');
                            });
                            Log::info("SMTP Mail sent successfully to student for Payment ID: {$payment->id}");
                        } catch (\Exception $e) {
                            Log::warning("SMTP Mail failed to send (using log driver fallback): " . $e->getMessage());
                        }
                    }
                }
            }
        }
    }
})->daily();
