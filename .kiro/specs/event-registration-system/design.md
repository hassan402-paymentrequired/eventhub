# Event Registration System Design

## Overview

The Event Registration System extends the existing event management platform to enable public event discovery and user registration. It leverages the existing Event, User, and EventRegistration models while adding new controllers, views, and business logic for the registration workflow.

## Architecture

The system follows Laravel MVC architecture with Inertia.js for the frontend:

- **Backend**: Laravel controllers handle registration logic, validation, and data persistence
- **Frontend**: React components with Inertia.js for seamless SPA experience
- **Database**: Extends existing schema with registration status tracking
- **Middleware**: Authentication middleware for protected registration actions

## Components and Interfaces

### Backend Components

**PublicEventsController**

- `index()` - List all published events with filtering/search
- `show($id)` - Display detailed event information
- `search(Request $request)` - Handle event search and filtering

**EventRegistrationController**

- `store(Event $event)` - Register user for event
- `destroy(EventRegistration $registration)` - Cancel registration
- `index()` - Show user's registrations

**EventOwnerController**

- `registrations(Event $event)` - Show event registration analytics
- `attendees(Event $event)` - List registered attendees

### Frontend Components

**PublicEventsList** - Browse and search events
**EventDetailsPage** - Detailed event view with registration button
**UserRegistrations** - Manage user's event registrations
**RegistrationConfirmation** - Post-registration confirmation
**OwnerRegistrationDashboard** - Event owner analytics

## Data Models

### Enhanced EventRegistration Model

```php
class EventRegistration extends Model {
    protected $fillable = ['event_id', 'user_id', 'registration_date', 'status'];

    // Relationships
    public function event(): BelongsTo
    public function user(): BelongsTo

    // Scopes
    public function scopeConfirmed($query)
    public function scopeForEvent($query, $eventId)
}
```

### Enhanced Event Model

```php
// Add methods to existing Event model
public function registrations(): HasMany
public function registeredUsers(): BelongsToMany
public function availableSpots(): int
public function isFull(): bool
public function isUserRegistered(User $user): bool
```

## Error Handling

- **Capacity Exceeded**: Return 422 with clear error message
- **Duplicate Registration**: Return 409 with existing registration info
- **Event Not Found**: Return 404 with helpful message
- **Unauthorized Access**: Return 403 for protected actions
- **Database Concurrency**: Use database transactions and locks

## Testing Strategy

### Unit Tests

- Event capacity calculations
- Registration validation logic
- User permission checks
- Model relationships and scopes

### Property-Based Tests

- Registration capacity constraints
- Data integrity during concurrent operations
- Search and filtering accuracy
- User-event relationship consistency

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

**Property 1: Event listing displays only published events**
_For any_ request to the public events page, all returned events should have status "published"
**Validates: Requirements 1.1**

**Property 2: Search results match search criteria**
_For any_ search query and event database, all returned events should contain the search term in title or description
**Validates: Requirements 1.2**

**Property 3: Category filtering accuracy**
_For any_ category filter and event database, all returned events should belong to the selected category
**Validates: Requirements 1.3**

**Property 4: Date range filtering accuracy**
_For any_ date range filter and event database, all returned events should have dates within the specified range
**Validates: Requirements 1.4**

**Property 5: Event listings contain required information**
_For any_ event listing display, each event should show title, date, location, category, and available spots
**Validates: Requirements 1.5**

**Property 6: Event details display completeness**
_For any_ event details page, all event information including speakers, agenda, FAQs, and images should be displayed
**Validates: Requirements 2.2**

**Property 7: Registration count accuracy**
_For any_ event, the displayed registration count should equal the actual number of confirmed registrations
**Validates: Requirements 2.3**

**Property 8: Ticket information display**
_For any_ event with tickets, all ticket types with prices and availability should be displayed
**Validates: Requirements 2.4**

**Property 9: Registration creates database record**
_For any_ successful registration attempt, a corresponding registration record should be created in the database
**Validates: Requirements 3.1**

**Property 10: Registration decreases capacity**
_For any_ successful registration, the event's available capacity should decrease by exactly one
**Validates: Requirements 3.2**

**Property 11: Duplicate registration prevention**
_For any_ user-event combination, only one active registration should be allowed
**Validates: Requirements 3.4**

**Property 12: User registration list accuracy**
_For any_ user, their registration page should display exactly the events they are registered for
**Validates: Requirements 4.1**

**Property 13: Registration display information**
_For any_ user registration display, event details and registration date should be shown
**Validates: Requirements 4.2**

**Property 14: Cancellation removes registration**
_For any_ registration cancellation, the registration record should be removed from the database
**Validates: Requirements 4.3**

**Property 15: Cancellation increases capacity**
_For any_ registration cancellation, the event's available capacity should increase by exactly one
**Validates: Requirements 4.4**

**Property 16: Owner registration count display**
_For any_ event owner viewing their event, the displayed registration count should be accurate
**Validates: Requirements 5.1**

**Property 17: Attendee list accuracy**
_For any_ event, the attendee list should contain exactly the users with confirmed registrations
**Validates: Requirements 5.2**

**Property 18: Attendee information display**
_For any_ attendee in the list, name and registration date should be displayed
**Validates: Requirements 5.3**

**Property 19: Real-time registration updates**
_For any_ registration change, owner views should reflect the updated count immediately
**Validates: Requirements 5.5**

**Property 20: Capacity validation before registration**
_For any_ registration attempt, capacity should be validated before creating the registration record
**Validates: Requirements 6.2**

**Property 21: User-event uniqueness constraint**
_For any_ registration creation, the user-event combination should be unique in the database
**Validates: Requirements 6.3**

**Property 22: Real-time capacity calculations**
_For any_ capacity calculation, it should be based on the current registration count in the database
**Validates: Requirements 6.4**
