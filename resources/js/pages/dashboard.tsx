import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Eye, Plus, TrendingUp, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardStats {
    totalEvents: number;
    totalRegistrations: number;
    upcomingEvents: number;
    recentEvents: any[];
}

interface Props {
    stats?: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    const { auth } = usePage<any>().props;

    // Default stats if not provided
    const dashboardStats = stats || {
        totalEvents: 0,
        totalRegistrations: 0,
        upcomingEvents: 0,
        recentEvents: [],
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Welcome back, {auth.user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        Here's what's happening with your events and
                        registrations.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    My Events
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {dashboardStats.totalEvents}
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/my-events">
                                <Button variant="outline" size="sm">
                                    View Events
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Registrations
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {dashboardStats.totalRegistrations}
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/my-registrations">
                                <Button variant="outline" size="sm">
                                    View Registrations
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Upcoming Events
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {dashboardStats.upcomingEvents}
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <Link href="/owner/dashboard">
                                <Button variant="outline" size="sm">
                                    View Analytics
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Quick Actions Card */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <Link href="/my-events/create" className="block">
                                <Button className="flex w-full items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488]">
                                    <Plus className="h-4 w-4" />
                                    Create New Event
                                </Button>
                            </Link>

                            <Link href="/events" className="block">
                                <Button
                                    variant="outline"
                                    className="flex w-full items-center gap-2"
                                >
                                    <Eye className="h-4 w-4" />
                                    Browse Events
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Recent Activity
                        </h2>

                        {dashboardStats.recentEvents.length > 0 ? (
                            <div className="space-y-3">
                                {dashboardStats.recentEvents
                                    .slice(0, 3)
                                    .map((event: any) => (
                                        <div
                                            key={event.id}
                                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {event.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(
                                                        event.start_time,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <Link href={`/events/${event.id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                <p className="mb-4 text-gray-600">
                                    No recent activity
                                </p>
                                <Link href="/my-events/create">
                                    <Button variant="outline" size="sm">
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
}
