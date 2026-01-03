<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class EventImage extends Model
{
    use HasUlids;

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
