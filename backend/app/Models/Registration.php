<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Registration extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'whatsapp',
        'email',
        'tanggal_lahir',
        'tujuan',
        'pelatih',
        'paket',
    ];
}
