<?php

namespace App\Http\Controllers;

use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\EventCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicEventsController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::query()
            ->published()
            ->upcoming()
            ->with(['category', 'user', 'images', 'tickets']);

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
            $query->whereDate('date', '>=', $request->get('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date', '<=', $request->get('date_to'));
        }

        // Single date filter (from welcome page)
        if ($request->filled('date')) {
            $query->whereDate('date', '=', $request->get('date'));
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

        $events = $query->orderBy('date', 'desc')
            ->orderBy('is_feature')
            ->paginate(12)
            ->withQueryString();

        $categories = EventCategory::all();

        return Inertia::render('PublicEvents/Index', [
            'events' => $events,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'date_from', 'date_to', 'date', 'location', 'is_online', 'is_free'])
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
        $event->user_registered = Auth::check() ? $event->isUserRegistered(Auth::user()) : false;

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
    public function featured()
    {
        $events = Event::query()
            ->published()
            ->upcoming()
            ->where('is_feature', true)
            ->with(['category', 'user', 'images', 'tickets'])
            ->withCount('registrations')
            ->take(6)
            ->get();

        return EventResource::collection($events);
    }

    public function popular()
    {
        $query = Event::query()
            ->published()
            ->upcoming()
            ->with(['category', 'user', 'images', 'tickets'])
            ->withCount('registrations');

        if (Auth::check()) {
            $user = Auth::user();

            // Log::info($user->interests->pluck('id'));

            // Filter by interests if available
            if ($user->interests()->exists()) {
                $query->whereIn('event_category_id', $user->interests->pluck('id'));
            }

            // Filter by location if available
            if ($user->preferred_location) {
                $query->where(function ($q) use ($user) {
                    $q->where('city', 'like', "%{$user->preferred_location}%")
                        ->orWhere('state', 'like', "%{$user->preferred_location}%");
                });
            }
        }

        $events = $query->orderBy('registrations_count', 'desc')
            ->take(8)
            ->get();

        return EventResource::collection($events);
    }
}
