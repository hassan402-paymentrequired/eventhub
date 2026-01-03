<?php

namespace App\Http\Controllers\Events;

use Inertia\Inertia;
use App\Http\Controllers\Controller;
use App\Http\Requests\EventStoreRequest;
use  App\Models\Event;
use Exception;
use Illuminate\Support\Facades\Auth;

class EventsController extends Controller
{

    public function index()
    {
        return Inertia::render('welcome');
    }

    public function events()
    {
        $events = Event::query()
            ->where('user_id', Auth::id())
            ->with(['speakers', 'tickets', 'agendas', 'faqs', 'images', 'category'])
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

            $event = Event::create([
                'user_id' => $data['user_id'],
                'name' => $data['title'],
                'description' => $data['description'],
                'start_time' => $data['start_date'],
                'end_time' => $data['end_date'],
                'venue_name' => $data['location_name'] ?? null,
                'event_category_id' => $data['category_id'],
                'address' => $data['location_address'] ?? null,
                'latitude' => $data['location_lat'] ?? null,
                'longitude' => $data['location_lng'] ?? null,
                'is_online' => $data['is_online'],
                'online_url' => $data['online_link'] ?? null,
                'is_free' => $data['is_free'],
                'capacity' => $data['capacity'] ?? null,
                'state' => $data['state'],
                'city' => $data['city'],
                'tags' => json_encode($data['tags']),
                'date' => $data['date'],
                'status' => $data['status']
            ]);


            foreach ($speakers as $speaker) {
                $event->speakers()->create([
                    'name' => $speaker['name'],
                    'title' => $speaker['title'],
                    'bio' => $speaker['bio'] ?? null,
                    'photo_url' => $speaker['image_url'] ?? null,
                ]);
            }

            $event->faqs()->createMany($faqs);
            $event->agendas()->createMany($agendas);

            foreach ($ticketTypes as $tic) {
                $event->tickets()->create([
                    'name' => $tic['name'],
                    'price' => $tic['price'],
                    'quantity_available' => $tic['quantity'],
                ]);
            }

            if (!empty($data['images'])) {
                foreach ($data['images'] as $img) {
                    $url = $img->store('business-images', 'public');
                    $event->images()->create([
                        'url' => $url,
                    ]);
                }
            }

            return redirect()->route('events.index')->with('success-toast', 'Event created successfully.');
        } catch (Exception $e) {
            return back()->with('error-toast', 'An error occurred.');
        }
    }
}
