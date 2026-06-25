<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WalkInLog extends Model
{
    protected $fillable = [
        'name',
        'whatsapp',
        'amount',
        'visit_date',
    ];
}
