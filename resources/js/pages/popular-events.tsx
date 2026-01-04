import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Button } from '@/components/button';
import { Container } from '@/components/container';
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

export default function PopularEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('/events/popular');
                const formattedEvents = response.data.data;
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch popular events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className="py-20 bg-gray-50/50">
            <Container>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        Popular Events
                    </h2>
                    
                    {/* Filters */}
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Today', 'Tomorrow', 'This Weekend', 'Free'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeFilter === filter
                                        ? 'border-purple-600 bg-purple-600 text-white'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="flex flex-col space-y-3">
                                  <Skeleton className="h-48 w-full rounded-xl" />
                                  <div className="space-y-2">
                                      <Skeleton className="h-4 w-[250px]" />
                                      <Skeleton className="h-4 w-[200px]" />
                                  </div>
                              </div>
                          ))
                        : events.map((event) => (
                              <EventCard key={event.id} event={event} />
                          ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/events">
                        <Button variant="outline" className="h-12 w-full min-w-[200px] border-gray-300 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto">
                            See More
                        </Button>
                    </Link>
                </div>
            </Container>
        </div>
    );
}
