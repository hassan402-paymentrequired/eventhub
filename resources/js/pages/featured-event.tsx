import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Link } from '@/components/link';
import { ArrowRight } from 'lucide-react';
import EventCard from './event/components/event-card';
import { Event } from './event/types';

interface DatabaseEvent {
    id: string;
    name: string;
    description: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    city: string;
    state: string;
    is_online: boolean;
    is_free: boolean;
    capacity: number;
    registration_count: number;
    available_spots: number;
    is_full: boolean;
    category: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    images: Array<{
        id: string;
        url: string;
    }>;
}

interface FeaturedEventsProps {
    events: DatabaseEvent[];
}

// Transform database event to EventCard format
const transformEvent = (dbEvent: DatabaseEvent): Event => {
    const startDate = new Date(dbEvent.start_time);

    return {
        id: dbEvent.id,
        title: dbEvent.name,
        description: dbEvent.description,
        date: startDate.toLocaleDateString(),
        time: startDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        }),
        location: dbEvent.is_online
            ? 'Online Event'
            : `${dbEvent.venue_name || ''}, ${dbEvent.city}, ${dbEvent.state}`.trim(),
        category: dbEvent.category?.name || 'General',
        image: dbEvent.images?.[0]?.url
            ? `/storage/${dbEvent.images[0].url}`
            : '/logo.svg',
        price: dbEvent.is_free ? 'Free' : 'Paid',
        attendees: dbEvent.registration_count || 0,
        featured: false,
        speakers: [],
        tickets: [],
        agendas: [],
        faqs: [],
        images: dbEvent.images || [],
    };
};

const FeaturedEvents = ({ events }: FeaturedEventsProps) => {
    // Transform database events to EventCard format
    const transformedEvents = events.map(transformEvent);
    const featuredEvents = transformedEvents.slice(0, 2);
    const regularEvents = transformedEvents.slice(2, 6);

    if (events.length === 0) {
        return (
            <section className="bg-background py-16">
                <Container>
                    <div className="text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
                            Featured <span className="text-accent">Events</span>
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
                            No events available at the moment. Check back soon
                            for exciting events!
                        </p>
                        <Link href="/events">
                            <Button variant="outline" className="group">
                                Browse All Events
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="bg-background py-16">
            <Container>
                {/* Section Header */}
                <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
                            Featured <span className="text-accent">Events</span>
                        </h2>
                        <p className="max-w-xl text-muted-foreground">
                            Hand-picked events that you don't want to miss. From
                            conferences to concerts, discover experiences that
                            inspire.
                        </p>
                    </div>
                    <Link href="/events">
                        <Button variant="outline" className="group">
                            View All Events
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                {/* Featured Events Grid */}
                {featuredEvents.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {featuredEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="animate-fade-up"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <EventCard event={event} variant="featured" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Regular Events Grid */}
                {regularEvents.length > 0 && (
                    <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {regularEvents.map((event, index) => (
                            <div
                                key={event.id}
                                className="animate-fade-up"
                                style={{
                                    animationDelay: `${(index + 2) * 0.1}s`,
                                }}
                            >
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
};

export default FeaturedEvents;
