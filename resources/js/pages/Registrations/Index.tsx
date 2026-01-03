import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Eye, Globe, MapPin, X } from 'lucide-react';
import { useState } from 'react';

interface Registration {
    id: string;
    registration_date: string;
    status: string;
    event: {
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
        category: {
            id: string;
            name: string;
        };
        images: Array<{
            id: string;
            url: string;
        }>;
    };
}

interface Props {
    registrations: {
        data: Registration[];
        links: any[];
        meta: any;
    };
}

const RegistrationsIndex = ({ registrations }: Props) => {
    const [cancellingId, setCancellingId] = useState<string | null>(null);

    const handleCancelRegistration = (registrationId: string) => {
        if (confirm('Are you sure you want to cancel this registration?')) {
            setCancellingId(registrationId);
            router.delete(`/registrations/${registrationId}`, {
                onFinish: () => setCancellingId(null),
                onError: () => setCancellingId(null),
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isEventUpcoming = (startTime: string) => {
        return new Date(startTime) > new Date();
    };

    const upcomingRegistrations = registrations.data.filter((reg) =>
        isEventUpcoming(reg.event.start_time),
    );

    const pastRegistrations = registrations.data.filter(
        (reg) => !isEventUpcoming(reg.event.start_time),
    );

    return (
        <AppLayout>
            <Head title="My Registrations" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            My Event Registrations
                        </h1>
                        <p className="text-gray-600">
                            Manage your upcoming and past event registrations
                        </p>
                    </div>

                    {registrations.data.length === 0 ? (
                        <div className="py-12 text-center">
                            <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h3 className="mb-2 text-lg font-medium text-gray-900">
                                No registrations yet
                            </h3>
                            <p className="mb-6 text-gray-600">
                                You haven't registered for any events yet.
                                Discover amazing events to attend!
                            </p>
                            <Link href="/events">
                                <Button className="bg-[#14B8A6] hover:bg-[#0d9488]">
                                    Browse Events
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Upcoming Events */}
                            {upcomingRegistrations.length > 0 && (
                                <div>
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                        Upcoming Events (
                                        {upcomingRegistrations.length})
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {upcomingRegistrations.map(
                                            (registration) => (
                                                <div
                                                    key={registration.id}
                                                    className="overflow-hidden rounded-lg border bg-white shadow-sm"
                                                >
                                                    {/* Event Image */}
                                                    <div className="relative h-48 bg-gray-200">
                                                        {registration.event
                                                            .images.length >
                                                        0 ? (
                                                            <img
                                                                src={
                                                                    registration
                                                                        .event
                                                                        .images[0]
                                                                        .url
                                                                }
                                                                alt={
                                                                    registration
                                                                        .event
                                                                        .name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1F44] to-[#14B8A6]">
                                                                <Calendar className="h-12 w-12 text-white" />
                                                            </div>
                                                        )}

                                                        {/* Status Badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                                Registered
                                                            </span>
                                                        </div>

                                                        {/* Category Badge */}
                                                        <div className="absolute top-3 right-3">
                                                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-gray-800">
                                                                {
                                                                    registration
                                                                        .event
                                                                        .category
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Event Content */}
                                                    <div className="p-6">
                                                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                                                            {
                                                                registration
                                                                    .event.name
                                                            }
                                                        </h3>

                                                        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                                            {
                                                                registration
                                                                    .event
                                                                    .description
                                                            }
                                                        </p>

                                                        {/* Event Details */}
                                                        <div className="mb-4 space-y-2">
                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {formatDate(
                                                                    registration
                                                                        .event
                                                                        .start_time,
                                                                )}
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-600">
                                                                <Clock className="mr-2 h-4 w-4" />
                                                                {formatTime(
                                                                    registration
                                                                        .event
                                                                        .start_time,
                                                                )}{' '}
                                                                -{' '}
                                                                {formatTime(
                                                                    registration
                                                                        .event
                                                                        .end_time,
                                                                )}
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-600">
                                                                {registration
                                                                    .event
                                                                    .is_online ? (
                                                                    <>
                                                                        <Globe className="mr-2 h-4 w-4" />
                                                                        Online
                                                                        Event
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MapPin className="mr-2 h-4 w-4" />
                                                                        {registration
                                                                            .event
                                                                            .venue_name ||
                                                                            `${registration.event.city}, ${registration.event.state}`}
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="mt-2 text-xs text-gray-500">
                                                                Registered on{' '}
                                                                {new Date(
                                                                    registration.registration_date,
                                                                ).toLocaleDateString()}
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/events/${registration.event.id}`}
                                                                className="flex-1"
                                                            >
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex w-full items-center gap-2"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                    View Event
                                                                </Button>
                                                            </Link>

                                                            <Button
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleCancelRegistration(
                                                                        registration.id,
                                                                    )
                                                                }
                                                                disabled={
                                                                    cancellingId ===
                                                                    registration.id
                                                                }
                                                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            >
                                                                {cancellingId ===
                                                                registration.id ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                                                ) : (
                                                                    <X className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Past Events */}
                            {pastRegistrations.length > 0 && (
                                <div>
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                        Past Events ({pastRegistrations.length})
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {pastRegistrations.map(
                                            (registration) => (
                                                <div
                                                    key={registration.id}
                                                    className="overflow-hidden rounded-lg border bg-white opacity-75 shadow-sm"
                                                >
                                                    {/* Event Image */}
                                                    <div className="relative h-48 bg-gray-200">
                                                        {registration.event
                                                            .images.length >
                                                        0 ? (
                                                            <img
                                                                src={
                                                                    registration
                                                                        .event
                                                                        .images[0]
                                                                        .url
                                                                }
                                                                alt={
                                                                    registration
                                                                        .event
                                                                        .name
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600">
                                                                <Calendar className="h-12 w-12 text-white" />
                                                            </div>
                                                        )}

                                                        {/* Status Badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                                                Attended
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Event Content */}
                                                    <div className="p-6">
                                                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-700">
                                                            {
                                                                registration
                                                                    .event.name
                                                            }
                                                        </h3>

                                                        <div className="mb-4 space-y-2">
                                                            <div className="flex items-center text-sm text-gray-500">
                                                                <Calendar className="mr-2 h-4 w-4" />
                                                                {formatDate(
                                                                    registration
                                                                        .event
                                                                        .start_time,
                                                                )}
                                                            </div>

                                                            <div className="flex items-center text-sm text-gray-500">
                                                                {registration
                                                                    .event
                                                                    .is_online ? (
                                                                    <>
                                                                        <Globe className="mr-2 h-4 w-4" />
                                                                        Online
                                                                        Event
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <MapPin className="mr-2 h-4 w-4" />
                                                                        {registration
                                                                            .event
                                                                            .venue_name ||
                                                                            `${registration.event.city}, ${registration.event.state}`}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <Link
                                                            href={`/events/${registration.event.id}`}
                                                            className="block w-full"
                                                        >
                                                            <Button
                                                                variant="outline"
                                                                className="w-full"
                                                            >
                                                                View Event
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {registrations.links &&
                                registrations.links.length > 3 && (
                                    <div className="mt-8 flex justify-center">
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
                                )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default RegistrationsIndex;
