<?php

use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Events\EventsController;
use App\Http\Controllers\PublicEventsController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\EventOwnerController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicEventsController::class, 'index'])->name('home');

// Public event routes (no authentication required)
Route::prefix('events')->name('public.events.')->group(function () {
    Route::get('/', [PublicEventsController::class, 'index'])->name('index');
    Route::get('/search', [PublicEventsController::class, 'search'])->name('search');
    Route::get('/{event}', [PublicEventsController::class, 'show'])->name('show');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Event management routes (for event owners)
    Route::prefix('my-events')->name('events.')->group(function () {
        Route::get('/', [EventsController::class, 'events'])->name('index');
        Route::get('/create', [EventsController::class, 'create'])->name('create');
        Route::post('/create', [EventsController::class, 'store'])->name('store');
    });

    // Event registration routes
    Route::prefix('events')->group(function () {
        Route::post('/{event}/register', [EventRegistrationController::class, 'store'])->name('events.register');
    });

    // User registration management routes
    Route::prefix('registrations')->name('registrations.')->group(function () {
        Route::get('/', [EventRegistrationController::class, 'index'])->name('index');
        Route::delete('/{registration}', [EventRegistrationController::class, 'destroy'])->name('destroy');
        Route::get('/{registration}/confirmation', [EventRegistrationController::class, 'confirmation'])->name('confirmation');
    });

    // Alternative route for user registrations
    Route::get('/my-registrations', [EventRegistrationController::class, 'index'])->name('my-registrations');

    // Event owner analytics routes
    Route::prefix('owner')->name('owner.')->group(function () {
        Route::get('/dashboard', [EventOwnerController::class, 'dashboard'])->name('dashboard');
        Route::get('/events/{event}/registrations', [EventOwnerController::class, 'registrations'])->name('event.registrations');
        Route::get('/events/{event}/attendees', [EventOwnerController::class, 'attendees'])->name('event.attendees');
        Route::get('/events/{event}/export-attendees', [EventOwnerController::class, 'exportAttendees'])->name('event.export-attendees');
    });
});

require __DIR__ . '/settings.php';
