import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Container } from '@/components/container';
import { Button } from '@/components/button';
import EventCard from './event/components/event-card'; 
import { Skeleton } from '@/components/ui/skeleton';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    image: string;
    price: string;
    organizer: string;
    attendees: number;
}

export default function FeaturedEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch from the route we created: /events/featured
                const response = await axios.get('/events/featured');
                setEvents(response.data.data);
            } catch (error) {
                console.error('Failed to fetch featured events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // If fully loaded and no events, don't show the section
    if (!loading && events.length === 0) return null;

    return (
        <div className="py-20">
            <Container>
                <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Featured Events
                        </h2>
                        <p className="mt-2 text-gray-600">
                            Don't miss out on these premium experiences.
                        </p>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {loading
                        ? Array.from({ length: 2 }).map((_, i) => (
                              <div key={i} className="flex flex-col space-y-3">
                                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                                  <div className="space-y-2">
                                      <Skeleton className="h-4 w-[80%]" />
                                      <Skeleton className="h-4 w-[60%]" />
                                  </div>
                              </div>
                          ))
                        : events.map((event) => (
                              <EventCard
                                  key={event.id}
                                  event={event}
                                  variant="featured"
                              />
                          ))}
                </div>
            </Container>
        </div>
    );
}
