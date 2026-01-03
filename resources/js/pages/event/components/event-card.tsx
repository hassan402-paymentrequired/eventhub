import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/link";
import { Event } from "../types";



interface EventCardProps {
  event: Event;
  variant?: "default" | "featured";
}

const EventCard = ({ event, variant = "default" }: EventCardProps) => {
  const isFeatured = variant === "featured";

  return (
    <Link href={`/events/${event.id}`}>
      <article
        className={`group relative overflow-hidden rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 ${
          isFeatured ? "md:flex" : ""
        }`}
      >
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            isFeatured ? "md:w-2/5 h-48 md:h-auto" : "h-48"
          }`}
        >
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
          
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 shadow-md">
            {event.category}
          </Badge>

          {/* Price Badge */}
          <Badge
            className={`absolute top-3 right-3 border-0 shadow-md ${
              event.price === "Free"
                ? "bg-teal-light text-teal-dark"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {event.price === "Free" ? "Free" : `$${event.price}`}
          </Badge>
        </div>

        {/* Content */}
        <div className={`p-5 ${isFeatured ? "md:w-3/5 md:p-6" : ""}`}>
          <h3 className={`font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2 ${
            isFeatured ? "text-xl md:text-2xl" : "text-lg"
          }`}>
            {event.title}
          </h3>
          
          <p className={`text-muted-foreground mt-2 line-clamp-2 ${
            isFeatured ? "text-base" : "text-sm"
          }`}>
            {event.description}
          </p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-accent" />
              <span>{event.date}</span>
              <Clock className="h-4 w-4 text-accent ml-2" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-accent" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-accent" />
              <span>{event.attendees} attending</span>
            </div>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 border-2 border-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </article>
    </Link>
  );
};

export default EventCard;
