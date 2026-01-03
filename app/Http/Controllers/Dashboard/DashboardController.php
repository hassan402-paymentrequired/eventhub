<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegisteration;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index()
    {
        $user = Auth::user();

        // Get user's events statistics
        $totalEvents = Event::where('user_id', $user->id)->count();
        $totalRegistrations = EventRegisteration::whereHas('event', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->count();
        $upcomingEvents = Event::where('user_id', $user->id)
            ->where('start_time', '>', now())
            ->count();

        // Get recent events
        $recentEvents = Event::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        $stats = [
            'totalEvents' => $totalEvents,
            'totalRegistrations' => $totalRegistrations,
            'upcomingEvents' => $upcomingEvents,
            'recentEvents' => $recentEvents
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats
        ]);
    }
}
