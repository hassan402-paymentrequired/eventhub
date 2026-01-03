import { Container } from '@/components/container';
import { Gradient } from '@/components/gradient';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    ChevronRightIcon,
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
    tags: string | null;
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
        <>
            <Head title={event.name} />

            <div className="relative">
                {event.images && event.images.length > 0 ? (
                    <div className="absolute inset-2 bottom-0 overflow-hidden rounded-4xl ring-1 ring-black/5 ring-inset">
                        <img
                            src={`/storage/${event.images[0].url}`}
                            alt={event.name}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
                    </div>
                ) : (
                    <Gradient className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset" />
                )}

                <Container className="relative">
                    <Navbar
                        banner={
                            <Link
                                href="#"
                                className="flex items-center gap-1 rounded-full bg-fuchsia-950/35 px-3 py-0.5 text-sm/6 font-medium text-white data-hover:bg-fuchsia-950/30"
                            >
                                Browse your favorite events and conferences
                                <ChevronRightIcon className="size-4" />
                            </Link>
                        }
                    />

                    <div className="flex items-end pt-32 pb-16">
                        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="text-white">
                                <div className="mb-4 flex items-center gap-2">
                                    <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white backdrop-blur-md">
                                        {event.category.name}
                                    </span>
                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-medium backdrop-blur-md ${
                                            event.is_free
                                                ? 'bg-green-500/30 text-green-100'
                                                : 'bg-blue-500/30 text-blue-100'
                                        }`}
                                    >
                                        {event.is_free
                                            ? 'Free Event'
                                            : 'Paid Event'}
                                    </span>
                                </div>

                                <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
                                    {event.name}
                                </h1>

                                <div className="flex items-center text-white/90">
                                    <User className="mr-2 h-5 w-5" />
                                    <span className="text-lg">
                                        Organized by {event.user.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className="bg-gray-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Event Details */}
                            <div className="rounded border border-gray-100 bg-white p-8 shadow-sm">
                                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                    About This Event
                                </h2>
                                <div className="prose prose-gray max-w-none">
                                    <p className="leading-relaxed text-gray-600">
                                        {event.description}
                                    </p>
                                </div>
                            </div>

                            {/* Event Schedule/Agenda */}
                            {event.agendas.length > 0 && (
                                <div className="rounded border border-gray-100 bg-white p-8 shadow-sm">
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                        Event Schedule
                                    </h2>
                                    <div className="relative space-y-8 before:absolute before:inset-0 before:left-[19px] before:h-full before:w-0.5 before:bg-gray-100">
                                        {event.agendas.map((agenda) => (
                                            <div
                                                key={agenda.id}
                                                className="relative pl-12"
                                            >
                                                {/* Timeline Dot */}
                                                <div className="absolute left-0 top-1.5 h-10 w-10 flex items-center justify-center rounded-full border-4 border-white bg-teal-50 text-teal-600 shadow-sm">
                                                    <Clock className="h-4 w-4" />
                                                </div>
                                                
                                                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 transition-colors hover:bg-gray-50">
                                                    <div className="mb-2 flex flex-wrap gap-2 text-sm font-medium text-teal-600">
                                                        <span>
                                                            {formatDateTime(
                                                                agenda.start_time,
                                                            )}
                                                        </span>
                                                        <span>-</span>
                                                        <span>
                                                            {formatDateTime(
                                                                agenda.end_time,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                                                        {agenda.title}
                                                    </h3>
                                                    {agenda.description && (
                                                        <p className="text-gray-600">
                                                            {agenda.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Speakers */}
                            {event.speakers.length > 0 && (
                                <div className="rounded border border-gray-100 bg-white p-8 shadow-sm">
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                        Featured Speakers
                                    </h2>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {event.speakers.map((speaker) => (
                                            <div
                                                key={speaker.id}
                                                className="group flex gap-5 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:shadow-md"
                                            >
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-100 bg-gray-100">
                                                    {speaker.photo_url ? (
                                                        <img
                                                            src={
                                                                speaker.photo_url
                                                            }
                                                            alt={speaker.name}
                                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-teal-50 text-teal-600">
                                                            <User className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 group-hover:text-teal-600">
                                                        {speaker.name}
                                                    </h3>
                                                    <p className="mb-2 text-sm font-medium text-teal-600">
                                                        {speaker.title}
                                                    </p>
                                                    {speaker.bio && (
                                                        <p className="line-clamp-2 text-sm text-gray-500">
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
                                <div className="rounded border border-gray-100 bg-white p-8 shadow-sm">
                                    <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                        Frequently Asked Questions
                                    </h2>
                                    <div className="space-y-4">
                                        {event.faqs.map((faq) => (
                                            <div
                                                key={faq.id}
                                                className="rounded-xl border border-gray-100 bg-gray-50/50 p-6"
                                            >
                                                <h3 className="mb-3 flex items-start gap-3 font-bold text-gray-900">
                                                    <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                                                    {faq.question}
                                                </h3>
                                                <p className="ml-8 text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Additional Images */}
                            {event.images.length > 1 && (
                                <div className="rounded border border-gray-100 bg-white p-8 shadow-sm">
                                    <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900">
                                        <ImageIcon className="h-6 w-6 text-teal-600" />
                                        Event Gallery
                                    </h2>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                        {event.images.slice(1).map((image) => (
                                            <div
                                                key={image.id}
                                                className="aspect-video overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-transform hover:scale-[1.02]"
                                            >
                                                <img
                                                    src={`/storage/${image.url}`}
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
                            <div className="sticky top-6 rounded border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
                                <div className="mb-6">
                                    <div className="mb-1 text-sm font-medium text-gray-500">
                                        price
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-gray-900">
                                            {event.is_free ? 'Free' : 'Paid'}
                                        </span>
                                        {!event.is_free &&
                                            event.tickets.length > 0 && (
                                                <span className="text-sm text-gray-500">
                                                    / per person (starts from $
                                                    {Math.min(
                                                        ...event.tickets.map(
                                                            (t) => t.price,
                                                        ),
                                                    )}
                                                    )
                                                </span>
                                            )}
                                    </div>

                                    <div className="mt-4">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-gray-600">
                                                Availability
                                            </span>
                                            <span
                                                className={
                                                    event.is_full
                                                        ? 'font-medium text-red-600'
                                                        : 'font-medium text-emerald-600'
                                                }
                                            >
                                                {event.is_full
                                                    ? 'Sold Out'
                                                    : 'Available'}
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    event.is_full
                                                        ? 'bg-red-500'
                                                        : 'bg-emerald-500'
                                                }`}
                                                style={{
                                                    width: `${
                                                        event.capacity
                                                            ? Math.min(
                                                                  100,
                                                                  (event.registration_count /
                                                                      event.capacity) *
                                                                      100,
                                                              )
                                                            : 0
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-1 text-xs text-gray-500">
                                            {event.available_spots === Infinity
                                                ? 'Unlimited spots'
                                                : `${event.available_spots} spots remaining`}
                                        </div>
                                    </div>
                                </div>

                                {event.user_registered ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 p-4 text-green-700">
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200">
                                                ✓
                                            </div>
                                            <span className="font-medium">
                                                You're registered!
                                            </span>
                                        </div>
                                        <Link href="/my-registrations" className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                            >
                                                View Ticket
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Button
                                        onClick={handleRegister}
                                        disabled={event.is_full}
                                        className="h-12 w-full bg-[#14B8A6] text-lg font-medium hover:bg-[#0d9488] shadow-lg shadow-teal-500/20 disabled:shadow-none"
                                    >
                                        {event.is_full
                                            ? 'Join Waitlist'
                                            : 'Register Now'}
                                    </Button>
                                )}
                            </div>

                            {/* Event Info Card */}
                            <div className="rounded border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
                                <h3 className="mb-4 text-lg font-bold text-gray-900">
                                    Event Details
                                </h3>

                                <div className="space-y-5">
                                    {/* Date & Time */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Date & Time
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(event.start_time)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatTime(event.start_time)} -{' '}
                                                {formatTime(event.end_time)}
                                            </p>
                                            <a
                                                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                                                    event.name,
                                                )}&dates=${new Date(
                                                    event.start_time,
                                                )
                                                    .toISOString()
                                                    .replace(
                                                        /-|:|\.\d\d\d/g,
                                                        '',
                                                    )}/${new Date(
                                                    event.end_time,
                                                )
                                                    .toISOString()
                                                    .replace(
                                                        /-|:|\.\d\d\d/g,
                                                        '',
                                                    )}&details=${encodeURIComponent(
                                                    event.description,
                                                )}&location=${encodeURIComponent(
                                                    event.venue_name ||
                                                        event.city,
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                            >
                                                + Add to Google Calendar
                                            </a>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-600">
                                            {event.is_online ? (
                                                <Globe className="h-5 w-5" />
                                            ) : (
                                                <MapPin className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                {event.is_online
                                                    ? 'Online Event'
                                                    : 'Location'}
                                            </h4>
                                            {event.is_online ? (
                                                <p className="text-sm text-gray-600">
                                                    Link provided after
                                                    registration
                                                </p>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-gray-900">
                                                        {event.venue_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {event.address &&
                                                            `${event.address}, `}
                                                        {event.city},{' '}
                                                        {event.state}
                                                    </p>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                            `${
                                                                event.venue_name ||
                                                                ''
                                                            } ${
                                                                event.address ||
                                                                ''
                                                            } ${
                                                                event.city || ''
                                                            }`,
                                                        )}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-1 inline-block text-xs font-medium text-pink-600 hover:text-pink-700 hover:underline"
                                                    >
                                                        Get Directions
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Refund Policy (Static for now as placeholder for "more info") */}
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                            <DollarSign className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">
                                                Refund Policy
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {event.is_free
                                                    ? 'Free Event'
                                                    : 'Contact organizer for refunds'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags (if any) */}
                            {event.tags && (
                                <div className="rounded border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/50">
                                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {event.tags
                                            .split(',')
                                            .map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                                                >
                                                    #{tag.trim()}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicEventShow;
