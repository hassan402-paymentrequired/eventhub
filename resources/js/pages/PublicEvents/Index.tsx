/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/button';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ChevronRightIcon, MapPin, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Category } from '../event/types';
import { Gradient } from '@/components/gradient';
import { Container } from '@/components/container';
import { Navbar } from '@/components/navbar';
import EventCard from '../event/components/event-card';
import { Event as CardEvent } from '../event/types';

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
    online_url: string;
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

interface Props {
    events: {
        data: DatabaseEvent[];
        links: any[];
        total: number
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        date_from?: string;
        date_to?: string;
        location?: string;
        is_online?: boolean;
        is_free?: boolean;
    };
}

const PublicEventsIndex = ({ events, categories, filters }: Props) => {
    console.log(events, categories, filters)
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || '',
    );
    const [showFilters, setShowFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (location) params.location = location;
        if (date) params.date = date;

        // Use Inertia router for seamless navigation
        router.get('/events', params);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const transformEvent = (dbEvent: DatabaseEvent): CardEvent => {
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


    return (
        <>
            <Head title="Discover Events" />

            <div className="relative">
            <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
            <Container className="relative">
                <Navbar
                    banner={
                        <Link
                            href="/blog/radiant-raises-100m-series-a-from-tailwind-ventures"
                            className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
                        >
                            Browse your favorite events and conferences
                            <ChevronRightIcon className="size-4" />
                        </Link>
                    }
                />


                <div className="pt-16 pb-24 sm:pt-24 md:pt-32">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Discover Amazing Events
                    </h1>
                    <p className="mb-8 max-w-xl text-gray-600">
                        Discover amazing events happening near you. Use filters
                        to find exactly what you're looking for.
                    </p>

                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg md:flex-row">
                            {/* Search Input */}
                            <div className="flex flex-1 items-center gap-3 border-b border-gray-200 px-4 py-4 md:border-r md:border-b-0">
                                <Search className="h-5 w-5 shrink-0 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    className="h-auto w-full border-0 bg-transparent p-0 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>

                            {/* Location Input */}
                            <div className="flex flex-1 items-center gap-3 border-b border-gray-200 px-4 py-4 md:border-r md:border-b-0">
                                <MapPin className="h-5 w-5 shrink-0 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Location"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    className="h-auto w-full border-0 bg-transparent p-0 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>

                            {/* Date Input */}
                            <div className="flex flex-1 items-center gap-3 px-4 py-4">
                                <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
                                <input
                                    type="date"
                                    placeholder="Any date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="h-auto w-full border-0 bg-transparent p-0 text-base outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>

                            {/* Search Button */}
                            <Button
                                type="submit"
                                className="m-0 shrink-0 rounded-none md:rounded-r-lg"
                            >
                                <Search className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Search</span>
                            </Button>
                        </div>
                    </form>
                </div>


            </Container>
        </div>

               <Container>
                <div className="mx-auto max-w-7xl py-8 ">
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Events ({events?.total})
                            </h2>
                        </div>

                       
                    </div>

                    {events.data.length > 0 ? (
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.data.map((event) => (
                                <div
                                    key={event.id}
                                    className="animate-fade-up"
                                >
                                    <EventCard event={transformEvent(event)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No events found
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Try adjusting your search criteria or check back
                                later for new events.
                            </p>
                        </div>
                    )}
                </div>
               </Container>
        </>
    );
};

export default PublicEventsIndex;




