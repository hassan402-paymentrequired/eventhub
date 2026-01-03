<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegisteration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventRegistrationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();

        $registrations = $user->registrations()
            ->with(['event' => function ($query) {
                $query->with(['category', 'images']);
            }])
            ->orderBy('registration_date', 'desc')
            ->paginate(10);

        return Inertia::render('Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    public function store(Request $request, Event $event)
    {
        $user = Auth::user();

        // Validate that event is published and upcoming
        if ($event->status !== 'published') {
            return back()->with('error', 'This event is not available for registration.');
        }

        if ($event->start_time <= now()) {
            return back()->with('error', 'Registration is closed for this event.');
        }

        // Use database transaction to handle concurrency
        try {
            return DB::transaction(function () use ($event, $user) {
                // Lock the event row to prevent race conditions
                $event = Event::lockForUpdate()->find($event->id);

                // Check if user is already registered
                if ($event->isUserRegistered($user)) {
                    return back()->with('error', 'You are already registered for this event.');
                }

                // Check capacity
                if ($event->isFull()) {
                    return back()->with('error', 'This event is full. Registration is no longer available.');
                }

                // Create registration
                $registration = EventRegisteration::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'status' => 'confirmed',
                    'registration_date' => now()
                ]);

                return redirect()->route('registrations.confirmation', $registration)
                    ->with('success', 'Successfully registered for the event!');
            });
        } catch (\Exception $e) {
            return back()->with('error', 'Registration failed. Please try again.');
        }
    }

    public function destroy(EventRegisteration $registration)
    {
        $user = Auth::user();

        // Ensure user owns this registration
        if ($registration->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Check if event hasn't started yet (allow cancellation only before event starts)
        if ($registration->event->start_time <= now()) {
            return back()->with('error', 'Cannot cancel registration for events that have already started.');
        }

        try {
            DB::transaction(function () use ($registration) {
                $registration->delete();
            });

            return back()->with('success', 'Registration cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to cancel registration. Please try again.');
        }
    }

    public function confirmation(EventRegisteration $registration)
    {
        $user = Auth::user();

        // Ensure user owns this registration
        if ($registration->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $registration->load(['event' => function ($query) {
            $query->with(['category', 'user', 'images']);
        }]);

        return Inertia::render('Registrations/Confirmation', [
            'registration' => $registration
        ]);
    }
}
