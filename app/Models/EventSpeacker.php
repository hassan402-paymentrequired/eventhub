<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class EventSpeacker extends Model
{
    use HasUlids;

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
