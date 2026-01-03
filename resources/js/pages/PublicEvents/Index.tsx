import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Filter, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';

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

interface Category {
    id: string;
    name: string;
    slug: string;
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

    const handleSearch = () => {
        router.get(
            '/events',
            {
                search: searchTerm,
                category: selectedCategory,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
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
        <AppLayout>
            <Head title="Discover Events" />

            <div className="min-h-screen bg-gray-50">
                <div className="bg-gradient-to-r from-[#0A1F44] to-[#14B8A6] py-16 text-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-4 text-4xl font-bold">
                                Discover Amazing Events
                            </h1>
                            <p className="mb-8 text-xl opacity-90">
                                Find and register for events that match your
                                interests
                            </p>

                            <div className="mx-auto flex max-w-2xl gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                            e.key === 'Enter' && handleSearch()
                                        }
                                        className="py-3 pl-10 text-gray-900"
                                    />
                                </div>
                                <Button
                                    onClick={handleSearch}
                                    className="bg-white px-6 text-[#0A1F44] hover:bg-gray-100"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Upcoming Events ({events.meta.total})
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
            </div>
        </AppLayout>
    );
};

export default PublicEventsIndex;
