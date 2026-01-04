import { Calendar, MapPin, Search, Heart, Star, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/link";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  variant?: "default" | "featured";
}

const EventCard = ({ event, variant = "default" }: EventCardProps) => {
  const isFeatured = variant === "featured";
  
  // Parse date for display
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();

  return (
    <Link href={`/events/${event.id}`} className="block h-full">
      <div className="group h-full flex flex-col rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-gray-100 overflow-hidden">
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Favorite Button */}
          <button 
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:bg-white hover:text-red-500"
            onClick={(e) => {
              e.preventDefault();
              // Add favorite logic here
            }}
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Category Badge - Bottom Left */}
          <span className="absolute bottom-3 left-3 rounded bg-[#FFD000] px-3 py-1 text-xs font-bold text-black shadow-sm">
            {event.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 p-4">
            {/* Date Block */}
            <div className="flex flex-col items-center pr-4 pt-1">
                <span className="text-xs font-bold uppercase text-purple-600">{month}</span>
                <span className="text-xl font-bold text-gray-900">{day}</span>
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col border-l border-gray-100 pl-4">
                <h3 className="mb-1 line-clamp-2 text-base font-bold leading-tight text-gray-900 group-hover:text-purple-600">
                    {event.title}
                </h3>
                
                {/* Organize subtitle/location name if available, or just location */}
                 <div className="mb-3 text-xs text-gray-500">
                    {event.location}
                 </div>

                 {/* Time */}
                 <div className="mb-4 flex items-center text-xs text-gray-500">
                    <span>{event.time}</span>
                 </div>

                 {/* Footer: Price & Interest */}
                 <div className="mt-auto flex items-center justify-between border-t border-dashed border-gray-200 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                        <Ticket className="h-3.5 w-3.5 text-gray-400" />
                        {event.price === "Free" || event.price === "0" ? "Free" : `$${event.price}`}
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <Star className="h-3.5 w-3.5 fill-purple-100 text-purple-500" />
                        <span>{event.attendees || 0} interested</span>
                    </div>
                 </div>
            </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
