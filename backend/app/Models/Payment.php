<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'invoice_no',
        'bill_date',
        'student_id',
        'student_name',
        'course_name',
        'class_fee',
        'discount',
        'subtotal',
        'num_installments',
        'installments',
        'payment_proof',
        'payment_method',
        'status',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'installments' => 'array',
        ];
    }
}
