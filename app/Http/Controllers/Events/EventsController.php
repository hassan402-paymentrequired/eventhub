<?php

namespace App\Http\Controllers\Events;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\EventStoreRequest;
use  App\Models\Event;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EventsController extends Controller
{

    public function index()
    {
        // Get featured events for the landing page
        $featuredEvents = Event::query()
            ->published()
            ->upcoming()
            ->with(['category', 'user', 'images'])
            ->orderBy('start_time')
            ->limit(6)
            ->get();

        // Add registration information
        $featuredEvents->transform(function ($event) {
            $event->registration_count = $event->getRegistrationCount();
            $event->available_spots = $event->availableSpots();
            $event->is_full = $event->isFull();
            return $event;
        });

        return Inertia::render('welcome', [
            'featuredEvents' => $featuredEvents
        ]);
    }

    public function events()
    {
        $events = Event::query()
            ->where('user_id', Auth::id())
            ->with(['speakers', 'tickets', 'agendas', 'faqs', 'images', 'category'])
            ->withCount('registrations')
            ->paginate();

        return Inertia::render('event/index', [
            'events' => $events,
        ]);
    }

    public function create()
    {
        $categories = \App\Models\EventCategory::all();
        return Inertia::render('event/create', [
            'categories' => $categories,
        ]);
    }

    public function store(EventStoreRequest $request)
    {
        $data = $request->validated();
        $data['user_id'] = Auth::id();

        $speakers = $data['speakers'] ?? [];
        $faqs = $data['faqs'] ?? [];
        $agendas = $data['agenda'] ?? [];
        $ticketTypes = $data['ticket_types'] ?? [];

        try {
            DB::beginTransaction();

            $event = Event::create([
                'user_id' => $data['user_id'],
                'name' => $data['title'],
                'description' => $data['description'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'venue_name' => $data['location_name'] ?? null,
                'event_category_id' => $data['category'],
                'address' => $data['location_address'] ?? null,
                'latitude' => $data['location_lat'] ?? null,
                'longitude' => $data['location_lng'] ?? null,
                'is_online' => $data['is_online'],
                'online_url' => $data['online_link'] ?? null,
                'is_free' => $data['is_free'],
                'capacity' => $data['capacity'] ?? null,
                'state' => $data['state'] ?? null,
                'city' => $data['city'] ?? null,
                'tags' => !empty($data['tags']) ? json_encode($data['tags']) : null,
                'date' => $data['date'],
                'status' => $data['status']
            ]);

            // Create speakers
            if (!empty($speakers)) {
                foreach ($speakers as $speaker) {
                    if (!empty($speaker['name']) && !empty($speaker['title'])) {
                        $event->speakers()->create([
                            'name' => $speaker['name'],
                            'title' => $speaker['title'],
                            'bio' => $speaker['bio'] ?? null,
                            'photo_url' => $speaker['image_url'] ?? null,
                        ]);
                    }
                }
            }

            // Create FAQs
            if (!empty($faqs)) {
                $validFaqs = array_filter($faqs, function ($faq) {
                    return !empty($faq['question']) && !empty($faq['answer']);
                });
                if (!empty($validFaqs)) {
                    $event->faqs()->createMany($validFaqs);
                }
            }

            // Create agenda items with proper datetime formatting
            if (!empty($agendas)) {
                foreach ($agendas as $agenda) {
                    if (!empty($agenda['title']) && !empty($agenda['start_time']) && !empty($agenda['end_time'])) {
                        $event->agendas()->create([
                            'title' => $agenda['title'],
                            'description' => $agenda['description'] ?? null,
                            'start_time' => $data['start_time'] . ' ' . $agenda['start_time'],
                            'end_time' => $data['start_time'] . ' ' . $agenda['end_time'],
                        ]);
                    }
                }
            }

            // Create tickets
            if (!empty($ticketTypes)) {
                foreach ($ticketTypes as $ticket) {
                    if (!empty($ticket['name'])) {
                        $event->tickets()->create([
                            'name' => $ticket['name'],
                            'price' => $ticket['price'] ?? 0,
                            'quantity_available' => $ticket['capacity'] ?? null,
                            'description' => $ticket['description'] ?? null,
                        ]);
                    }
                }
            }

            // Handle image uploads
            if (!empty($data['images'])) {
                foreach ($data['images'] as $img) {
                    $url = $img->store('event-images', 'public');
                    $event->images()->create([
                        'url' => $url,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('events.index')->with('success-toast', 'Event created successfully!');
        } catch (Exception $e) {
            DB::rollBack();
            \Illuminate\Support\Facades\Log::error('Event creation failed: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => Auth::id(),
            ]);
            return back()->withInput()->with('error-toast', 'An error occurred while creating the event. Please try again.');
        }
    }
}
