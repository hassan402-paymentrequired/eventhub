<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicEventsController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()
            ->published()
            ->upcoming()
            ->with(['category', 'user', 'images']);

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->get('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('event_category_id', $request->get('category'));
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('start_time', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('start_time', '<=', $request->get('date_to'));
        }

        // Location filter
        if ($request->filled('location')) {
            $location = $request->get('location');
            $query->where(function ($q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                    ->orWhere('state', 'like', "%{$location}%")
                    ->orWhere('venue_name', 'like', "%{$location}%");
            });
        }

        // Online/offline filter
        if ($request->filled('is_online')) {
            $query->where('is_online', $request->boolean('is_online'));
        }

        // Free/paid filter
        if ($request->filled('is_free')) {
            $query->where('is_free', $request->boolean('is_free'));
        }

        $events = $query->orderBy('start_time')
            ->paginate(12)
            ->withQueryString();

        // Add registration count and available spots to each event
        $events->getCollection()->transform(function ($event) {
            $event->registration_count = $event->getRegistrationCount();
            $event->available_spots = $event->availableSpots();
            $event->is_full = $event->isFull();
            return $event;
        });

        $categories = EventCategory::all();

        return Inertia::render('PublicEvents/Index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'date_from', 'date_to', 'location', 'is_online', 'is_free'])
        ]);
    }

    public function show(Event $event)
    {
        // Only show published events
        if ($event->status !== 'published') {
            abort(404);
        }

        $event->load([
            'category',
            'user',
            'speakers',
            'tickets',
            'agendas' => function ($query) {
                $query->orderBy('start_time');
            },
            'faqs',
            'images'
        ]);

        // Add registration information
        $event->registration_count = $event->getRegistrationCount();
        $event->available_spots = $event->availableSpots();
        $event->is_full = $event->isFull();

        // Check if current user is registered (if authenticated)
        $event->user_registered = auth()->check() ? $event->isUserRegistered(auth()->user()) : false;

        return Inertia::render('PublicEvents/Show', [
            'event' => $event
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100'
        ]);

        $searchTerm = $request->get('q');

        $events = Event::query()
            ->published()
            ->upcoming()
            ->where(function ($query) use ($searchTerm) {
                $query->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('city', 'like', "%{$searchTerm}%")
                    ->orWhere('venue_name', 'like', "%{$searchTerm}%");
            })
            ->with(['category', 'user'])
            ->limit(10)
            ->get();

        // Add registration info
        $events->transform(function ($event) {
            $event->registration_count = $event->getRegistrationCount();
            $event->available_spots = $event->availableSpots();
            return $event;
        });

        return response()->json([
            'events' => $events
        ]);
    }
}
