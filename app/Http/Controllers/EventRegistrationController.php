<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventRegisteration;
use App\Services\PaystackService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventRegistrationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $registrations = $user->registrations()
            ->with([
                'event' => function ($query) {
                    $query->with(['category', 'images']);
                }
            ])
            ->orderBy('registration_date', 'desc')
            ->paginate(10);

        return Inertia::render('Registrations/Index', [
            'registrations' => $registrations
        ]);
    }

    public function store(Request $request, Event $event, PaystackService $paystack)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'ticket_id' => 'nullable|exists:event_tickets,id',
            'quantity' => 'required|integer|min:1|max:10',
            'attendee_details' => 'nullable|array',
            'attendee_details.name' => 'required_with:attendee_details|string',
            'attendee_details.email' => 'required_with:attendee_details|email',
        ]);

        if ($event->status !== 'published') {
            return back()->with('error-toast', 'This event is not available for registration.');
        }

        // Allow registration until end time? usually start time. existing code said start_time.
        if ($event->date <= now()) {
            return back()->with('error-toast', 'Registration is closed for this event.');
        }

        try {
            return DB::transaction(function () use ($event, $user, $validated, $paystack) {
                $event = Event::lockForUpdate()->find($event->id);

                if ($event->isFull() || $event->availableSpots() < $validated['quantity']) {
                    throw new \Exception('Not enough spots available.');
                }

                $totalPrice = 0;
                $ticketId = $validated['ticket_id'] ?? null;
                $ticket = null;

                if ($ticketId) {
                    $ticket = $event->tickets()->lockForUpdate()->find($ticketId);
                    if (!$ticket)
                        throw new \Exception('Invalid ticket selected.');

                    if ($ticket->quantity_available !== null && $ticket->quantity_available < $validated['quantity']) {
                        throw new \Exception('Not enough tickets available.');
                    }

                    $totalPrice = $ticket->price * $validated['quantity'];
                } else {
                    if (!$event->is_free)
                        throw new \Exception('Please select a ticket for paid events.');
                }

                $status = $totalPrice > 0 ? 'pending_payment' : 'confirmed';

                // Reduce Quantity if confirmed immediately (Free)
                // For paid, we hold the spot? Or reduce only after payment?
                // Usually for tickets, we reserve ("hold") them.
                // For MVP, lets decrement NOW. If payment fails, we'd need to release (cron job or cancel).
                // Or we decrement only on success. But then overbooking risk during payment window.
                // Let's decrement NOW.

                if ($ticket && $ticket->quantity_available !== null) {
                    $ticket->decrement('quantity_available', $validated['quantity']);
                }

                $registration = EventRegisteration::create([
                    'event_id' => $event->id,
                    'user_id' => $user->id,
                    'ticket_id' => $ticketId,
                    'quantity' => $validated['quantity'],
                    'total_price' => $totalPrice,
                    'attendee_details' => $validated['attendee_details'] ?? null,
                    'status' => $status,
                    'registration_date' => now()
                ]);

                if ($totalPrice > 0) {
                    try {
                        $callbackUrl = route('events.payment.callback');
                        $paystackData = $paystack->initializeTransaction(
                            $user->email,
                            $totalPrice,
                            $registration->id, // Reference
                            $callbackUrl
                        );
                        Log::info('Paystack initialization data: ', $paystackData);
                        return Inertia::location($paystackData['data']['authorization_url']);
                        // return redirect()->away($paystackData['data']['authorization_url']);
                    } catch (\Exception $e) {
                         Log::info('error here');
                        // Rollback ticket decrement if paystack fails?
                        // DB Transaction rolls back everything if we throw.
                        throw $e;
                    }
                }

                return redirect()->route('registrations.confirmation', $registration)
                    ->with('success-toast', 'Successfully registered for the event!');
            });
        } catch (\Exception $e) {
             Log::info('error here'. $e->getMessage());
            return back()->with('error', $e->getMessage());
        }
    }

    public function handlePaymentCallback(Request $request, PaystackService $paystack)
    {
        $reference = $request->query('reference');

        try {
            $data = $paystack->verifyTransaction($reference);

            if ($data['status'] === true && $data['data']['status'] === 'success') {
                $registration = EventRegisteration::findOrFail($reference);

                if ($registration->status !== 'confirmed') {
                    $registration->update(['status' => 'confirmed']);
                }

                return redirect()->route('registrations.confirmation', $registration)
                    ->with('success-toast', 'Payment successful! Registration confirmed.');
            }

            return redirect()->route('dashboard')->with('error-toast', 'Payment verification failed.');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error-toast', 'Payment verification failed: ' . $e->getMessage());
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

            return back()->with('success-toast', 'Registration cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error-toast', 'Failed to cancel registration. Please try again.');
        }
    }

    public function confirmation(EventRegisteration $registration)
    {
        $user = Auth::user();

        // Ensure user owns this registration
        if ($registration->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        $registration->load([
            'event' => function ($query) {
                $query->with(['category', 'user', 'images']);
            }
        ]);

        return Inertia::render('Registrations/Confirmation', [
            'registration' => $registration
        ]);
    }
}
