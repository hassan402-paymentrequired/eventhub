import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    Clock,
    DollarSign,
    Globe,
    Image as ImageIcon,
    MapPin,
    MessageCircle,
    User,
    Users,
} from 'lucide-react';

interface Event {
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
    capacity: number;
    registration_count: number;
    available_spots: number;
    is_full: boolean;
    user_registered: boolean;
    category: {
        id: string;
        name: string;
    };
    user: {
        id: string;
        name: string;
    };
    speakers: Array<{
        id: string;
        name: string;
        title: string;
        bio: string;
        photo_url: string;
    }>;
    tickets: Array<{
        id: string;
        name: string;
        price: number;
        description: string;
        quantity_available: number;
    }>;
    agendas: Array<{
        id: string;
        title: string;
        description: string;
        start_time: string;
        end_time: string;
    }>;
    faqs: Array<{
        id: string;
        question: string;
        answer: string;
    }>;
    images: Array<{
        id: string;
        url: string;
    }>;
}

interface Props {
    event: Event;
}

const PublicEventShow = ({ event }: Props) => {
    const handleRegister = () => {
        router.post(
            `/events/${event.id}/register`,
            {},
            {
                onSuccess: () => {
                    // Handle success in the controller redirect
                },
                onError: (errors) => {
                    console.error('Registration failed:', errors);
                },
            },
        );
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

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AppLayout>
            <Head title={event.name} />

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative">
                    {event.images.length > 0 ? (
                        <div className="h-96 bg-gray-900">
                            <img
                                src={event.images[0].url}
                                alt={event.name}
                                className="h-full w-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    ) : (
                        <div className="h-96 bg-gradient-to-r from-[#0A1F44] to-[#14B8A6]" />
                    )}

                    <div className="absolute inset-0 flex items-end">
                        <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                            <div className="text-white">
                                <Link
                                    href="/events"
                                    className="mb-4 inline-flex items-center text-white/80 hover:text-white"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Events
                                </Link>

                                <div className="mb-2 flex items-center gap-2">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                                        {event.category.name}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium ${
                                            event.is_free
                                                ? 'bg-green-500/20 text-green-100'
                                                : 'bg-blue-500/20 text-blue-100'
                                        }`}
                                    >
                                        {event.is_free
                                            ? 'Free Event'
                                            : 'Paid Event'}
                                    </span>
                                </div>

                                <h1 className="mb-4 text-4xl font-bold">
                                    {event.name}
                                </h1>

                                <div className="mb-2 flex items-center text-white/90">
                                    <User className="mr-2 h-5 w-5" />
                                    Organized by {event.user.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Event Details */}
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                    About This Event
                                </h2>
                                <div className="prose max-w-none">
                                    <p className="leading-relaxed text-gray-700">
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            {/* Event Schedule/Agenda */}
                            {event.agendas.length > 0 && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                        Event Schedule
                                    </h2>
                                    <div className="space-y-4">
                                        {event.agendas.map((agenda) => (
                                            <div
                                                key={agenda.id}
                                                className="border-l-4 border-[#14B8A6] pl-4"
                                            >
                                                <div className="mb-1 flex items-center gap-2 text-sm text-gray-600">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDateTime(
                                                        agenda.start_time,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatDateTime(
                                                        agenda.end_time,
                                                    )}
                                                </div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {agenda.title}
                                                </h3>
                                                {agenda.description && (
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {agenda.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Speakers */}
                            {event.speakers.length > 0 && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                        Speakers
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {event.speakers.map((speaker) => (
                                            <div
                                                key={speaker.id}
                                                className="flex gap-4"
                                            >
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                                                    {speaker.photo_url ? (
                                                        <img
                                                            src={
                                                                speaker.photo_url
                                                            }
                                                            alt={speaker.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-[#14B8A6] text-white">
                                                            <User className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {speaker.name}
                                                    </h3>
                                                    <p className="mb-2 text-sm text-gray-600">
                                                        {speaker.title}
                                                    </p>
                                                    {speaker.bio && (
                                                        <p className="text-sm text-gray-700">
                                                            {speaker.bio}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* FAQs */}
                            {event.faqs.length > 0 && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-2xl font-bold text-gray-900">
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-4">
                                        {event.faqs.map((faq) => (
                                            <div key={faq.id}>
                                                <h3 className="mb-2 flex items-start gap-2 font-semibold text-gray-900">
                                                    <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#14B8A6]" />
                                                    {faq.question}
                                                </h3>
                                                <p className="ml-7 text-gray-700">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Images */}
                            {event.images.length > 1 && (
                                <div className="rounded-lg border bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                        <ImageIcon className="h-6 w-6" />
                                        Event Gallery
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {event.images.slice(1).map((image) => (
                                            <div
                                                key={image.id}
                                                className="aspect-video overflow-hidden rounded-lg bg-gray-200"
                                            >
                                                <img
                                                    src={image.url}
                                                    alt="Event image"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Registration Card */}
                            <div className="sticky top-6 rounded-lg border bg-white p-6 shadow-sm">
                                <div className="mb-6 text-center">
                                    <div className="mb-2 text-3xl font-bold text-gray-900">
                                        {event.is_free ? 'Free' : 'Paid Event'}
                                    </div>

                                    <div className="mb-4 flex items-center justify-center text-gray-600">
                                        <Users className="mr-2 h-5 w-5" />
                                        {event.is_full ? (
                                            <span className="font-medium text-red-600">
                                                Event Full
                                            </span>
                                        ) : (
                                            <span>
                                                {event.available_spots ===
                                                Infinity
                                                    ? `${event.registration_count} registered`
                                                    : `${event.available_spots} spots available`}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {event.user_registered ? (
                                    <div className="text-center">
                                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4">
                                            <p className="font-medium text-green-800">
                                                ✓ You're registered for this
                                                event
                                            </p>
                                        </div>
                                        <Link href="/my-registrations">
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                View My Registrations
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleRegister}
                                        disabled={event.is_full}
                                        className="w-full bg-[#14B8A6] hover:bg-[#0d9488] disabled:bg-gray-300"
                                    >
                                        {event.is_full
                                            ? 'Event Full'
                                            : 'Register Now'}
                                    </Button>
                                )}
                            </div>

                            {/* Event Info */}
                            <div className="rounded-lg border bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    Event Details
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {formatDate(event.start_time)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {formatTime(event.start_time)} -{' '}
                                                {formatTime(event.end_time)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        {event.is_online ? (
                                            <>
                                                <Globe className="mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        Online Event
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Link will be provided
                                                        after registration
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="mt-0.5 h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {event.venue_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {event.address &&
                                                            `${event.address}, `}
                                                        {event.city},{' '}
                                                        {event.state}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {!event.is_free &&
                                        event.tickets.length > 0 && (
                                            <div className="flex items-start gap-3">
                                                <DollarSign className="mt-0.5 h-5 w-5 text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="mb-2 font-medium text-gray-900">
                                                        Ticket Types
                                                    </p>
                                                    <div className="space-y-2">
                                                        {event.tickets.map(
                                                            (ticket) => (
                                                                <div
                                                                    key={
                                                                        ticket.id
                                                                    }
                                                                    className="flex items-center justify-between text-sm"
                                                                >
                                                                    <span className="text-gray-700">
                                                                        {
                                                                            ticket.name
                                                                        }
                                                                    </span>
                                                                    <span className="font-medium">
                                                                        $
                                                                        {
                                                                            ticket.price
                                                                        }
                                                                    </span>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default PublicEventShow;
