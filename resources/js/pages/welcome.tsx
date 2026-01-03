import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Gradient } from '@/components/gradient';
import { Navbar } from '@/components/navbar';
import { Testimonials } from '@/components/testimonials';
import { Head, Link } from '@inertiajs/react';
import { Calendar, ChevronRightIcon, MapPin, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import FeaturedEvents from './featured-event';

export default function Welcome() {
    

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="overflow-hidden">
                <Hero />
                <FeaturedEvents />
                <Testimonials />
                <Footer />
            </div>
        </>
    );
}

function Hero() {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();

        // Build query parameters
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (location) params.append('location', location);
        if (date) params.append('date', date);

        // For Inertia.js, you would use:
        // router.get(`/events?${params.toString()}`);

        // For demo purposes:
        console.log('Search params:', {
            search: searchQuery,
            location: location,
            date: date,
        });

        // Redirect to events page with query params
        window.location.href = `/events?${params.toString()}`;
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };
    return (
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
                <div className="pt-16 pb-24 sm:pt-24  md:pt-32 ">
                    <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Browse <span className="text-purple-600">Events</span>
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
                                    onKeyPress={handleKeyPress}
                                    className="h-auto outline-none w-full border-0 bg-transparent p-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                    onKeyPress={handleKeyPress}
                                    className="h-auto w-full outline-none border-0 bg-transparent p-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                                    className="h-auto w-full outline-none border-0 bg-transparent p-0 text-base placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
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
    );
}
