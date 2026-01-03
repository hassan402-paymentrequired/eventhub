import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Globe,
    MapPin,
    Share2,
    User,
} from 'lucide-react';

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
        address: string;
        is_online: boolean;
        online_url: string;
        is_free: boolean;
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
    };
}

interface Props {
    registration: Registration;
}

const RegistrationConfirmation = ({ registration }: Props) => {
    const { event } = registration;

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

    const handleAddToCalendar = () => {
        const startDate = new Date(event.start_time);
        const endDate = new Date(event.end_time);

        const formatCalendarDate = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${formatCalendarDate(startDate)}/${formatCalendarDate(endDate)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.is_online ? 'Online Event' : `${event.venue_name}, ${event.address}, ${event.city}, ${event.state}`)}`;

        window.open(calendarUrl, '_blank');
    };

    const handleShare = async () => {
        const shareData = {
            title: event.name,
            text: `I just registered for ${event.name}!`,
            url: window.location.origin + `/events/${event.id}`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('Event link copied to clipboard!');
        }
    };

    return (
        <AppLayout>
            <Head title="Registration Confirmed" />

            <div className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Success Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">
                            Registration Confirmed!
                        </h1>
                        <p className="text-lg text-gray-600">
                            You're all set for this amazing event
                        </p>
                    </div>

                    {/* Event Details Card */}
                    <div className="mb-8 overflow-hidden rounded-lg border bg-white shadow-sm">
                        {/* Event Image */}
                        <div className="relative h-64 bg-gray-200">
                            {event.images.length > 0 ? (
                                <img
                                    src={event.images[0].url}
                                    alt={event.name}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0A1F44] to-[#14B8A6]">
                                    <Calendar className="h-16 w-16 text-white" />
                                </div>
                            )}

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-800">
                                    {event.category.name}
                                </span>
                            </div>

                            {/* Free/Paid Badge */}
                            <div className="absolute top-4 right-4">
                                <span
                                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                                        event.is_free
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                    }`}
                                >
                                    {event.is_free
                                        ? 'Free Event'
                                        : 'Paid Event'}
                                </span>
                            </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-8">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                {event.name}
                            </h2>

                            <p className="mb-6 leading-relaxed text-gray-700">
                                {event.description}
                            </p>

                            {/* Event Details Grid */}
                            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Date
                                            </p>
                                            <p className="text-gray-600">
                                                {formatDate(event.start_time)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Time
                                            </p>
                                            <p className="text-gray-600">
                                                {formatTime(event.start_time)} -{' '}
                                                {formatTime(event.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        {event.is_online ? (
                                            <>
                                                <Globe className="mt-1 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Location
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Online Event
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Event link will be sent
                                                        closer to the date
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
                                                        {event.venue_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {event.address &&
                                                            `${event.address}, `}
                                                        {event.city},{' '}
                                                        {event.state}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <User className="mt-1 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Organizer
                                            </p>
                                            <p className="text-gray-600">
                                                {event.user.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Registration Info */}
                            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
                                <h3 className="mb-2 font-semibold text-green-800">
                                    Registration Details
                                </h3>
                                <div className="text-sm text-green-700">
                                    <p>
                                        Registration ID:{' '}
                                        <span className="font-mono">
                                            {registration.id}
                                        </span>
                                    </p>
                                    <p>
                                        Registered on:{' '}
                                        {new Date(
                                            registration.registration_date,
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                    <p>
                                        Status:{' '}
                                        <span className="font-medium capitalize">
                                            {registration.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    onClick={handleAddToCalendar}
                                    className="flex items-center gap-2 bg-[#14B8A6] hover:bg-[#0d9488]"
                                >
                                    <Download className="h-4 w-4" />
                                    Add to Calendar
                                </Button>

                                <Button
                                    onClick={handleShare}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share Event
                                </Button>

                                <Link
                                    href="/my-registrations"
                                    className="flex-1 sm:flex-initial"
                                >
                                    <Button
                                        variant="outline"
                                        className="flex w-full items-center gap-2"
                                    >
                                        View All Registrations
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* What's Next Section */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            What's Next?
                        </h3>

                        <div className="space-y-3 text-gray-700">
                            <div className="flex items-start gap-3">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#14B8A6]"></div>
                                <p>
                                    You'll receive a confirmation email with all
                                    the event details
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#14B8A6]"></div>
                                <p>
                                    We'll send you reminders as the event date
                                    approaches
                                </p>
                            </div>

                            {event.is_online && (
                                <div className="flex items-start gap-3">
                                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#14B8A6]"></div>
                                    <p>
                                        The event link will be sent to you 24
                                        hours before the event
                                    </p>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#14B8A6]"></div>
                                <p>
                                    You can cancel your registration anytime
                                    before the event starts
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Browse More Events */}
                    <div className="mt-8 text-center">
                        <p className="mb-4 text-gray-600">
                            Looking for more events to attend?
                        </p>
                        <Link href="/events">
                            <Button
                                variant="outline"
                                className="mx-auto flex items-center gap-2"
                            >
                                Browse More Events
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default RegistrationConfirmation;
