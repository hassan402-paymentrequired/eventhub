<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

class UserInterest extends Model
{
    use HasUlids;

    protected $table = 'user_interests';
}
