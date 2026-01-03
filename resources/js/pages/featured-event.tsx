import { Link } from "@/components/link";
import { mockEvents } from "@/data/mockData";
import { ArrowRight } from "lucide-react";
import EventCard from "./event/components/event-card";
import { Container } from "@/components/container";
import { Button } from "@/components/button";

const FeaturedEvents = () => {
  const featuredEvents = mockEvents.filter((e) => e.featured);

  return (
    <section className="py-16 bg-background">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Featured <span className="text-accent">Events</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Hand-picked events that you don't want to miss. From conferences to concerts, 
              discover experiences that inspire.
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Featured Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredEvents.slice(0, 2).map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <EventCard event={event} variant="featured" />
            </div>
          ))}
        </div>

        {/* Regular Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockEvents.slice(3, 6).map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-up"
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedEvents;
