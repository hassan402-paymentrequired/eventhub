<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Event
 *
 * @property string $id
 * @property string $title
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $start_date
 * @property \Illuminate\Support\Carbon|null $end_date
 * @property string|null $location
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @mixin \Eloquent
 */
class Event extends Model
{
    use HasUlids;

    protected $fillable = [
        'name',
        'description',
        'start_time',
        'end_time',
        'address',
        'city',
        'state',
        'venue_name',
        'latitude',
        'longitude',
        'is_online',
        'online_url',
        'is_free',
        'capacity',
        'tags',
        'date',
        'user_id',
        'event_category_id',
        'status'
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'date' => 'date',
        'is_online' => 'boolean',
        'is_free' => 'boolean',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'capacity' => 'integer',
    ];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EventCategory::class, 'event_category_id');
    }


    public function tickets(): HasMany
    {
        return $this->hasMany(EventTicket::class);
    }

    public function speakers(): HasMany
    {
        return $this->hasMany(EventSpeacker::class);
    }

    public function agendas(): HasMany
    {
        return $this->hasMany(EventAgenda::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(EventFaq::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(EventImage::class);
    }

    public function registrations(): HasMany
    {
        return $this->hasMany(EventRegisteration::class);
    }

    public function registeredUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_registerations', 'event_id', 'user_id')
            ->withTimestamps();
    }

    // Registration-related methods
    public function availableSpots(): int
    {
        if (!$this->capacity) {
            return PHP_INT_MAX; // Unlimited capacity
        }

        $registeredCount = $this->registrations()->count();
        return max(0, $this->capacity - $registeredCount);
    }

    public function isFull(): bool
    {
        return $this->availableSpots() === 0;
    }

    public function isUserRegistered(User $user): bool
    {
        return $this->registrations()
            ->where('user_id', $user->id)
            ->exists();
    }

    public function getRegistrationCount(): int
    {
        return $this->registrations()->count();
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now());
    }
}
