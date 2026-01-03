import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Download,
    Mail,
    MapPin,
    TrendingUp,
    Users,
} from 'lucide-react';

interface Event {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    city: string;
    state: string;
    is_online: boolean;
    capacity: number;
    category: {
        id: string;
        name: string;
    };
}

interface Registration {
    id: string;
    registration_date: string;
    status: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

interface Analytics {
    total_registrations: number;
    available_spots: number;
    capacity: number;
    is_full: boolean;
    registration_rate: number;
}

interface Props {
    event: Event;
    registrations: {
        data: Registration[];
        links: any[];
        meta: any;
    };
    analytics: Analytics;
}

const EventRegistrations = ({ event, registrations, analytics }: Props) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title={`Registrations - ${event.name}`} />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/owner/dashboard"
                            className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                    Event Registrations
                                </h1>
                                <p className="text-gray-600">{event.name}</p>
                            </div>
                            <div className="flex gap-3">
                                <Link
                                    href={`/owner/events/${event.id}/export-attendees`}
                                >
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export CSV
                                    </Button>
                                </Link>
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="outline">
                                        View Public Page
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Event Info Card */}
                    <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="flex items-start gap-3">
                                <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Event Date
                                    </p>
                                    <p className="text-gray-600">
                                        {formatDate(event.start_time)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                {event.is_online ? (
                                    <>
                                        <Clock className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Location
                                            </p>
                                            <p className="text-gray-600">
                                                Online Event
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <MapPin className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Location
                                            </p>
                                            <p className="text-gray-600">
                                                {event.venue_name}, {event.city}
                                                , {event.state}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="mt-1 h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Capacity
                                    </p>
                                    <p className="text-gray-600">
                                        {analytics.capacity
                                            ? `${analytics.capacity} attendees`
                                            : 'Unlimited'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Registrations
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {analytics.total_registrations}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Users className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Available Spots
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {analytics.available_spots === Infinity
                                            ? '∞'
                                            : analytics.available_spots}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Fill Rate
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {analytics.registration_rate}%
                                    </p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <TrendingUp className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Status
                                    </p>
                                    <p
                                        className={`text-lg font-bold ${analytics.is_full ? 'text-red-600' : 'text-green-600'}`}
                                    >
                                        {analytics.is_full ? 'Full' : 'Open'}
                                    </p>
                                </div>
                                <div
                                    className={`rounded-full p-3 ${analytics.is_full ? 'bg-red-100' : 'bg-green-100'}`}
                                >
                                    <Users
                                        className={`h-6 w-6 ${analytics.is_full ? 'text-red-600' : 'text-green-600'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Registrations Table */}
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Registered Attendees (
                                    {registrations.meta.total})
                                </h2>
                            </div>
                        </div>

                        {registrations.data.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Attendee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Registration Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {registrations.data.map(
                                            (registration) => (
                                                <tr
                                                    key={registration.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#14B8A6] font-medium text-white">
                                                                {registration.user.name
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        registration
                                                                            .user
                                                                            .name
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {
                                                                registration
                                                                    .user.email
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                        {formatDateTime(
                                                            registration.registration_date,
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                            {
                                                                registration.status
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        <a
                                                            href={`mailto:${registration.user.email}`}
                                                            className="flex items-center gap-1 text-[#14B8A6] hover:text-[#0d9488]"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            Contact
                                                        </a>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No registrations yet
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    When people register for your event, they'll
                                    appear here.
                                </p>
                                <Link href={`/events/${event.id}`}>
                                    <Button variant="outline">
                                        View Event Page
                                    </Button>
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {registrations.links &&
                            registrations.links.length > 3 && (
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex justify-center">
                                        <div className="flex gap-2">
                                            {registrations.links.map(
                                                (link, index) => (
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
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EventRegistrations;
