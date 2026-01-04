<?php

namespace App\Http\Controllers;

use App\Models\EventCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index()
    {
        return Inertia::render('onboarding/wizard', [
            'categories' => EventCategory::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'interests' => 'required|array|min:1',
            'interests.*' => 'exists:event_categories,id',
            'preferred_location' => 'nullable|string|max:255',
            'event_preference' => 'required|string|in:online,in_person,both',
            'is_organizer' => 'required|boolean',
        ]);

        $user = Auth::user();

        // Update user profile
        $user->update([
            'preferred_location' => $validated['preferred_location'],
            'event_preference' => $validated['event_preference'],
            'is_organizer' => $validated['is_organizer'],
            'onboarding_completed' => true,
        ]);

        // Sync interests
        $user->interests()->sync($validated['interests']);

        return redirect()->route('dashboard');
    }
}
