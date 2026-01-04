<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $price = 'Free';
        if (!$this->is_free) {
            // Check if tickets relation is loaded or load it? accessing it directly will lazy load if not careful.
            // Ideally controller loads it.
            $tickets = $this->tickets;

            if ($tickets->isEmpty()) {
                $price = 'Paid';
            } else {
                $min = $tickets->min('price');
                $max = $tickets->max('price');
                if ($min == $max) {
                    $price = '$' . number_format($min, 2);
                } else {
                    $price = '$' . number_format($min, 2) . ' - $' . number_format($max, 2);
                }
            }
        }

        return [
            'id' => $this->id,
            'title' => $this->name,
            'description' => $this->description,
            'date' => $this->start_time, // Frontend wraps in new Date()
            'time' => $this->start_time ? $this->start_time->format('H:i') : null,
            'location' => $this->venue_name ?? $this->city,
            'category' => $this->category ? $this->category->name : 'Uncategorized',
            'image' => $this->images->first() ? '/storage/' . $this->images->first()->url : '/images/event-placeholder.jpg',
            'price' => $price,
            'organizer' => $this->user ? $this->user->name : 'Unknown',
            'attendees' => $this->registration_count ?? $this->registrations_count ?? 0, // Handle both accessor injection styles
        ];
    }
}
