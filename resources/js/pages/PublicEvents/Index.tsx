/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navbar } from '@/components/navbar';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import EventCard from '../event/components/event-card';
import { Category, Event } from '../event/types';
import SearchBar from '../event/components/search';
import FilterSidebar from '../event/components/filter';
import { Filter, MapPin } from 'lucide-react';

interface Props {
    events: {
        data: Event[];
        links: any[];
        total: number;
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

const PublicEventsIndex = ({ events , categories}: Props) => {
    console.log(events);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
    const [filters, setFilters] = useState({
        location: '',
        radius: 25,
        dateRange: { start: null, end: null },
        categories: [],
        priceRange: [0, 500],
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);


    const handleShare = (event: Event) => {
        if (navigator?.share) {
            navigator.share({
                title: event?.name,
                text: `Check out ${event?.name} at ${event?.venue_name}`,
                url: window.location?.href,
            });
        } else {
            alert('Event link copied to clipboard!');
        }
    };

    return (
        <>
            <Head title="Discover Events" />
            <div className="min-h-screen bg-background">
                 <Navbar />
                <div className="pt-16">
                    {/* Search and View Toggle */}
                    <div className="border-b-4 border-primary bg-card">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                                <SearchBar
                                    searchQuery={searchQuery}
                                    setSearchQuery={setSearchQuery}
                                />

                                <div className="flex w-full gap-3 lg:w-auto">
                                    <button
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className="brutalist-shadow hover:shadow-brutalist-sm flex items-center gap-2 border-2 border-primary bg-accent px-6 py-3 font-bold text-accent-foreground transition-all"
                                    >
                                        <Filter size={20} />
                                        Filters
                                    </button>

                                    <button
                                        onClick={() =>
                                            setViewMode(
                                                viewMode === 'grid'
                                                    ? 'map'
                                                    : 'grid',
                                            )
                                        }
                                        className="brutalist-shadow hover:shadow-brutalist-sm flex items-center gap-2 border-2 border-primary bg-primary px-6 py-3 font-bold text-primary-foreground transition-all"
                                    >
                                        <MapPin size={20} />
                                        {viewMode === 'grid'
                                            ? 'Map View'
                                            : 'Grid View'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-6 lg:flex-row">
                            {/* Filter Sidebar */}
                            {showFilters && (
                                <div className="flex-shrink-0 lg:w-80">
                                    <FilterSidebar
                                    categories={categories}
                                        filters={filters}
                                        setFilters={setFilters}
                                    />
                                </div>
                            )}

                            {/* Events Display */}
                            <div className="flex-1">
                               
                                    <div>
                                        <div className="mb-6">
                                            <h2 className="mb-2 text-2xl font-black text-primary">
                                                {events?.total} Events
                                                Found
                                            </h2>
                                            <p className="text-muted-foreground">
                                                Discover amazing events near you
                                            </p>
                                        </div>

                                        {loading ? (
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                                {[1, 2, 3, 4, 5, 6]?.map(
                                                    (i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-concrete h-96 animate-pulse border-2 border-primary"
                                                        ></div>
                                                    ),
                                                )}
                                            </div>
                                        ) : events?.data.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                                                {events.data?.map(
                                                    (event) => (
                                                        <EventCard
                                                            key={event?.id}
                                                            event={event}
                                                            onShare={() =>
                                                                handleShare(
                                                                    event
                                                                )
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="border-2 border-primary bg-card py-16 text-center">
                                                <p className="text-xl font-bold text-muted-foreground">
                                                    No events found matching
                                                    your criteria
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setFilters({
                                                            location: '',
                                                            radius: 25,
                                                            dateRange: {
                                                                start: null,
                                                                end: null,
                                                            },
                                                            categories: [],
                                                            priceRange: [
                                                                0, 500,
                                                            ],
                                                        });
                                                        setSearchQuery('');
                                                    }}
                                                    className="brutalist-shadow hover:shadow-brutalist-sm mt-4 border-2 border-primary bg-primary px-6 py-3 font-bold text-primary-foreground transition-all"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        )}
                                    </div>
                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicEventsIndex;
