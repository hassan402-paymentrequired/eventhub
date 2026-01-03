import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Eye, MapPin, Plus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'My Events',
        href: '#',
    },
];

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
    is_free: boolean;
    capacity: number;
    status: string;
    category: {
        id: string;
        name: string;
    };
    images: Array<{
        id: string;
        url: string;
    }>;
    registrations_count?: number;
}

interface Props {
    events: {
        data: Event[];
        links: any[];
        meta: unknown;
    };
}

const Index = ({ events }: Props) => {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Head title="My Events" />
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                My Events
                            </h1>
                            <p className="text-gray-600">
                                Manage and track your created events
                            </p>
                        </div>
                        <Link href="/my-events/create">
                            <Button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488]">
                                <Plus className="h-4 w-4" />
                                Create Event
                            </Button>
                        </Link>
                    </div>

                    {events.data.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {events.data.map((event) => (
                                <div
                                    key={event.id}
                                    className="overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {/* Event Image */}
                                    <div className="relative h-48 bg-gray-200">
                                        {event.images.length > 0 ? (
                                            <img
                                                src={`/storage/${event.images[0].url}`}
                                                alt={event.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1F44] to-[#14B8A6]">
                                                <Calendar className="h-12 w-12 text-white" />
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        <div className="absolute top-3 left-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(event.status)}`}
                                            >
                                                {event.status}
                                            </span>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                                                {event.category.name}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Event Content */}
                                    <div className="p-6">
                                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                                            {event.name}
                                        </h3>

                                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                            {event.description}
                                        </p>

                                        {/* Event Details */}
                                        <div className="mb-4 space-y-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {formatDate(event.start_time)}{' '}
                                                at{' '}
                                                {formatTime(event.start_time)}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="mr-2 h-4 w-4" />
                                                {event.is_online
                                                    ? 'Online Event'
                                                    : `${event.venue_name || event.city}, ${event.state}`}
                                            </div>

                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="mr-2 h-4 w-4" />
                                                {event.registrations_count || 0}{' '}
                                                registered
                                                {event.capacity &&
                                                    ` / ${event.capacity} capacity`}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/events/${event.id}`}
                                                className="flex-1"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="flex w-full items-center gap-2"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>

                                            <Link
                                                href={`/owner/events/${event.id}/registrations`}
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="flex items-center gap-2"
                                                >
                                                    <Users className="h-4 w-4" />
                                                    Registrations
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No events created yet
                            </h3>
                            <p className="mb-6 text-gray-600">
                                Create your first event to start managing
                                registrations and analytics.
                            </p>
                            <Link href="/my-events/create">
                                <Button className="bg-[#14B8A6] hover:bg-[#0d9488]">
                                    Create Your First Event
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* Pagination */}
                    {events.links && events.links.length > 3 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex gap-2">
                                {events.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`rounded-md px-3 py-2 text-sm ${
                                            link.active
                                                ? 'bg-[#14B8A6] text-white'
                                                : 'border bg-white text-gray-700 hover:bg-gray-50'
                                        } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
};

export default Index;
