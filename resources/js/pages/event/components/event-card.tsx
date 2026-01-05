import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, MapPin, Share2 } from 'lucide-react';
import { Event } from '../types';

interface Props {
    event: Event;
    onShare: () => void;
}

const EventCard = ({ event, onShare }: Props) => {
    return (
        <div className="brutalist-shadow hover:shadow-brutalist-lg group overflow-hidden border-4 border-primary bg-card transition-all duration-300">
            {/* Event Image */}
            <div className="bg-concrete relative h-48 overflow-hidden">
                <img
                    src={`/storage/${event.images[0].url}`}
                    alt={`${event?.name} event banner`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 border-2 border-primary bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    {event?.category.name}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <button
                        onClick={onShare}
                        className="border-2 border-primary bg-card p-2 transition-colors hover:bg-accent"
                        aria-label="Share event"
                    >
                        <Share2 size={18} className="text-primary" />
                    </button>
                </div>
            </div>

            {/* Event Details */}
            <div className="p-5">
                <h3 className="mb-3 line-clamp-2 text-xl font-black text-primary">
                    {event?.title}
                </h3>

                <div className="mb-4 space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                        <Calendar
                            size={16}
                            className="mt-0.5 flex-shrink-0 text-primary"
                        />
                        <span className="font-medium text-muted-foreground">
                            {format(
                                new Date(event?.date),
                                'MMM dd, yyyy • h:mm a',
                            )}
                        </span>
                    </div>

                    <div className="flex items-start gap-2 text-sm">
                        <MapPin
                            size={16}
                            className="mt-0.5 flex-shrink-0 text-primary"
                        />
                        <span className="line-clamp-1 font-medium text-muted-foreground">
                            {event?.venue_name}
                        </span>
                    </div>

                    {event?.user && (
                        <div className="text-sm">
                            <span className="font-bold text-primary">
                                Organizer:{' '}
                            </span>
                            <span className="font-medium text-muted-foreground">
                                {event?.user?.name}
                            </span>
                        </div>
                    )}
                </div>

                {/* Price and CTA */}
                <div className="border-concrete flex items-center justify-between border-t-2 pt-4">
                    <div className="flex items-center gap-1">
                        <span className="text-base font-black text-primary">
                            {event?.is_free ? 'FREE' : 'paid'}
                        </span>
                    </div>

                    <Button>View Details</Button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
