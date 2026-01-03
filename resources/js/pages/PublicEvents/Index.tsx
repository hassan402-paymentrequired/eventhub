/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/button';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, ChevronRightIcon, Clock, Filter, MapPin, Search, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Category } from '../event/types';
import { Gradient } from '@/components/gradient';
import { Container } from '@/components/container';
import { Navbar } from '@/components/navbar';

interface Event {
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
        data: Event[];
        links: any[];
        meta: any;
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


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
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
                            Browse your favorite events and conference
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
                <div className="mx-auto max-w-7xl x-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Events ({events?.meta?.total})
                            </h2>
                            <Button
                                variant="outline"
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filters
                            </Button>
                        </div>

                        {showFilters && (
                            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Category
                                        </label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        >
                                            <option value="">
                                                All Categories
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button onClick={handleSearch}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {events.data.length > 0 ? (
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.data.map((event) => (
                                <div
                                    key={event.id}
                                    className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <div className="relative h-48 bg-gray-200">
                                        {event.images.length > 0 ? (
                                            <img
                                                src={event.images[0].url}
                                                alt={event.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1F44] to-[#14B8A6]">
                                                <Calendar className="h-12 w-12 text-white" />
                                            </div>
                                        )}

                                        <div className="absolute top-3 left-3">
                                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                                                {event.category.name}
                                            </span>
                                        </div>

                                        <div className="absolute top-3 right-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                    event.is_free
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}
                                            >
                                                {event.is_free
                                                    ? 'Free'
                                                    : 'Paid'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                                            {event.name}
                                        </h3>

                                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                            {event.description}
                                        </p>

                                        <div className="mb-4 space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formatDate(event.start_time)}{' '}
                                                at{' '}
                                                {formatTime(event.start_time)}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                {event.is_online ? (
                                                    <>
                                                        <Clock className="mr-2 h-4 w-4" />
                                                        Online Event
                                                    </>
                                                ) : (
                                                    <>
                                                        <MapPin className="mr-2 h-4 w-4" />
                                                        {event.venue_name ||
                                                            `${event.city}, ${event.state}`}
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="mr-2 h-4 w-4" />
                                                {event.is_full ? (
                                                    <span className="font-medium text-red-600">
                                                        Event Full
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {event.available_spots ===
                                                        Infinity
                                                            ? `${event.registration_count} registered`
                                                            : `${event.available_spots} spots left`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/events/${event.id}`}
                                            className="block w-full"
                                        >
                                            <Button className="w-full bg-[#14B8A6] hover:bg-[#0d9488]">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
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




