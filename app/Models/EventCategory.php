<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class EventCategory extends Model
{
    use HasUlids;

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
