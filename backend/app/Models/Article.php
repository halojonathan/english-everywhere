<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date_created',
        'intro_paragraphs',
        'sections',
        'thumbnail',
    ];

    protected $casts = [
        'intro_paragraphs' => 'array',
        'sections' => 'array',
    ];
}
