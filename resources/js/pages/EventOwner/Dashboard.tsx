import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    Eye,
    Plus,
    TrendingUp,
    Users,
} from 'lucide-react';

interface Event {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    capacity: number;
    registrations_count: number;
    available_spots: number;
    is_full: boolean;
    registration_rate: number;
    status: string;
    category: {
        id: string;
        name: string;
    };
}

interface Stats {
    total_events: number;
    total_registrations: number;
    upcoming_events: number;
    full_events: number;
}

interface Props {
    events: Event[];
    stats: Stats;
}

const EventOwnerDashboard = ({ events, stats }: Props) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
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
        <AppLayout>
            <Head title="Event Analytics Dashboard" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="mb-2 text-3xl font-bold text-gray-900">
                                Event Analytics Dashboard
                            </h1>
                            <p className="text-gray-600">
                                Monitor your events performance and
                                registrations
                            </p>
                        </div>
                        <Link href="/my-events/create">
                            <Button className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488]">
                                <Plus className="h-4 w-4" />
                                Create Event
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Events
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.total_events}
                                    </p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Registrations
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.total_registrations}
                                    </p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Upcoming Events
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.upcoming_events}
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
                                        Full Events
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stats.full_events}
                                    </p>
                                </div>
                                <div className="rounded-full bg-red-100 p-3">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Events Table */}
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <BarChart3 className="h-5 w-5" />
                                Your Events Performance
                            </h2>
                        </div>

                        {events.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Event
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Registrations
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Capacity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Fill Rate
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {events.map((event) => (
                                            <tr
                                                key={event.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {event.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                event.category
                                                                    .name
                                                            }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {formatDate(
                                                        event.start_time,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(event.status)}`}
                                                    >
                                                        {event.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {event.registrations_count}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                    {event.capacity ||
                                                        'Unlimited'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
                                                            <div
                                                                className="h-2 rounded-full bg-[#14B8A6]"
                                                                style={{
                                                                    width: `${Math.min(event.registration_rate, 100)}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-gray-900">
                                                            {
                                                                event.registration_rate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/events/${event.id}`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Eye className="h-3 w-3" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        <Link
                                                            href={`/owner/events/${event.id}/registrations`}
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Users className="h-3 w-3" />
                                                                Registrations
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">
                                    No events created yet
                                </h3>
                                <p className="mb-6 text-gray-600">
                                    Create your first event to start tracking
                                    registrations and analytics.
                                </p>
                                <Link href="/my-events/create">
                                    <Button className="bg-[#14B8A6] hover:bg-[#0d9488]">
                                        Create Your First Event
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default EventOwnerDashboard;
