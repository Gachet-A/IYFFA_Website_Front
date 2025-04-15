/*This component allows scrolling through Events proposed by the association*/
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { addMonths, isAfter, isBefore, parseISO } from "date-fns";
import { formatEventDateRange } from "@/lib/dateUtils";
import { useQuery } from "@tanstack/react-query";

export const EventSlider = () => {
  const today = new Date();
  const nextMonth = addMonths(today, 1);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/events/');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      return data;
    },
  });
  
  // Filter events to show only upcoming events within the next month
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.start_datetime);
      return isAfter(eventDate, today) && isBefore(eventDate, nextMonth);
    })
    .slice(0, 3); // Limit to 3 events

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-16 px-4 bg-popover">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-[#1EAEDB] mb-8 text-center">Upcoming Events</h2>
        
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-[#1A1F2C] border-[#1EAEDB]">
                <CardContent className="p-0">
                  <img
                    src={event.images?.[0]?.img_url || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error("EventSlider - Image failed to load:", event.images?.[0]?.img_url);
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div className="p-6">
                    <div className="flex items-center text-secondary mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatEventDateRange(event.start_datetime, event.end_datetime)}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1EAEDB]">{event.title}</h3>
                    <p className="text-white mb-4">{event.description}</p>
                    <Link to={`/event/${event.id}`}>
                      <Button variant="outline" className="w-full border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-[#1A1F2C] rounded-lg border border-[#1EAEDB]/20">
            <p className="text-white text-lg">No upcoming events scheduled for the next month.</p>
            <Link to="/events" className="inline-block mt-4">
              <Button variant="outline" className="border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                View All Events
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
