<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventOwnerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function registrations(Event $event)
    {
        // Ensure user owns this event
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $event->load(['category']);

        $registrations = $event->registrations()
            ->with(['user'])
            ->orderBy('registration_date', 'desc')
            ->paginate(20);

        $analytics = [
            'total_registrations' => $event->getRegistrationCount(),
            'available_spots' => $event->availableSpots(),
            'capacity' => $event->capacity,
            'is_full' => $event->isFull(),
            'registration_rate' => $event->capacity ? round(($event->getRegistrationCount() / $event->capacity) * 100, 1) : 0
        ];

        return Inertia::render('EventOwner/Registrations', [
            'event' => $event,
            'registrations' => $registrations,
            'analytics' => $analytics
        ]);
    }

    public function attendees(Event $event)
    {
        // Ensure user owns this event
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $attendees = $event->registeredUsers()
            ->wherePivot('status', 'confirmed')
            ->withPivot(['registration_date', 'status'])
            ->orderBy('event_registerations.registration_date', 'desc')
            ->get();

        return Inertia::render('EventOwner/Attendees', [
            'event' => $event,
            'attendees' => $attendees
        ]);
    }

    public function dashboard()
    {
        $user = Auth::user();

        $events = $user->events()
            ->with(['category'])
            ->withCount('registrations')
            ->orderBy('start_time', 'desc')
            ->get();

        // Add analytics for each event
        $events->transform(function ($event) {
            $event->available_spots = $event->availableSpots();
            $event->is_full = $event->isFull();
            $event->registration_rate = $event->capacity ?
                round(($event->registrations_count / $event->capacity) * 100, 1) : 0;
            return $event;
        });

        $totalEvents = $events->count();
        $totalRegistrations = $events->sum('registrations_count');
        $upcomingEvents = $events->where('start_time', '>', now())->count();
        $fullEvents = $events->where('is_full', true)->count();

        return Inertia::render('EventOwner/Dashboard', [
            'events' => $events,
            'stats' => [
                'total_events' => $totalEvents,
                'total_registrations' => $totalRegistrations,
                'upcoming_events' => $upcomingEvents,
                'full_events' => $fullEvents
            ]
        ]);
    }

    public function exportAttendees(Event $event)
    {
        // Ensure user owns this event
        if ($event->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        $attendees = $event->registeredUsers()
            ->wherePivot('status', 'confirmed')
            ->withPivot(['registration_date'])
            ->get();

        $csvData = [];
        $csvData[] = ['Name', 'Email', 'Registration Date'];

        foreach ($attendees as $attendee) {
            $csvData[] = [
                $attendee->name,
                $attendee->email,
                $attendee->pivot->registration_date->format('Y-m-d H:i:s')
            ];
        }

        $filename = "attendees-{$event->name}-" . now()->format('Y-m-d') . '.csv';

        $callback = function () use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$filename}",
        ]);
    }
}
