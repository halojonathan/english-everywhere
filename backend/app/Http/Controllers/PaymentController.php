<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $payments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|string|max:255',
            'invoice_no' => 'required|string|max:255',
            'bill_date' => 'required|string|max:255',
            'student_id' => 'nullable|integer',
            'student_name' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'class_fee' => 'required|integer',
            'discount' => 'required|integer',
            'subtotal' => 'required|integer',
            'num_installments' => 'required|integer|min:1|max:4',
            'installments' => 'required|array',
            'payment_proof' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'status' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $payment = Payment::create([
            'transaction_id' => $request->input('transaction_id'),
            'invoice_no' => $request->input('invoice_no'),
            'bill_date' => $request->input('bill_date'),
            'student_id' => $request->input('student_id'),
            'student_name' => $request->input('student_name'),
            'course_name' => $request->input('course_name'),
            'class_fee' => $request->input('class_fee'),
            'discount' => $request->input('discount'),
            'subtotal' => $request->input('subtotal'),
            'num_installments' => $request->input('num_installments'),
            'installments' => $request->input('installments'),
            'payment_proof' => $request->input('payment_proof'),
            'payment_method' => $request->input('payment_method'),
            'status' => $request->input('status', 'Pending'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bill created successfully.',
            'data' => $payment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bill not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|string|max:255',
            'invoice_no' => 'required|string|max:255',
            'bill_date' => 'required|string|max:255',
            'student_id' => 'nullable|integer',
            'student_name' => 'required|string|max:255',
            'course_name' => 'required|string|max:255',
            'class_fee' => 'required|integer',
            'discount' => 'required|integer',
            'subtotal' => 'required|integer',
            'num_installments' => 'required|integer|min:1|max:4',
            'installments' => 'required|array',
            'payment_proof' => 'nullable|string',
            'payment_method' => 'nullable|string',
            'status' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $payment->update([
            'transaction_id' => $request->input('transaction_id'),
            'invoice_no' => $request->input('invoice_no'),
            'bill_date' => $request->input('bill_date'),
            'student_id' => $request->input('student_id'),
            'student_name' => $request->input('student_name'),
            'course_name' => $request->input('course_name'),
            'class_fee' => $request->input('class_fee'),
            'discount' => $request->input('discount'),
            'subtotal' => $request->input('subtotal'),
            'num_installments' => $request->input('num_installments'),
            'installments' => $request->input('installments'),
            'payment_proof' => $request->input('payment_proof'),
            'payment_method' => $request->input('payment_method'),
            'status' => $request->input('status', 'Pending'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bill updated successfully.',
            'data' => $payment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Bill not found.'
            ], 404);
        }

        $payment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Bill deleted successfully.'
        ]);
    }
}
