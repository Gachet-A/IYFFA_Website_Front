
/*Ce composant permet de faire défiler les Events proposer par l'association*/
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { addMonths, isAfter, isBefore, parseISO } from "date-fns";
import { isFutureEvent, formatEventDateRange } from "@/lib/dateUtils";

// Events data with ISO dates for better comparison
const events = [
  {
    id: 1,
    title: "Global Youth Entrepreneurship Summit",
    date: "2024-06-15T09:00:00",
    endDate: "2024-06-17T17:00:00",
    location: "New York, USA",
    image: "/placeholder.svg",
    description: "Connect with young entrepreneurs from over 50 countries.",
  },
  {
    id: 2,
    title: "Future Founders Workshop Series",
    date: "2024-07-22T10:30:00",
    endDate: "2024-07-25T16:00:00",
    location: "London, UK",
    image: "/placeholder.svg",
    description: "Learn from successful founders and industry experts.",
  },
  {
    id: 3,
    title: "Innovation Challenge 2024",
    date: "2024-08-10T08:00:00",
    location: "Singapore",
    image: "/placeholder.svg",
    description: "Pitch your ideas and win funding for your startup.",
  },
  {
    id: 4,
    title: "Tech for Good Hackathon",
    date: "2025-02-15T09:00:00",
    endDate: "2025-02-17T18:00:00",
    location: "Berlin, Germany",
    image: "/placeholder.svg",
    description: "Develop solutions for pressing social and environmental challenges.",
  },
  {
    id: 5,
    title: "Young Leaders Conference",
    date: "2025-04-08T10:00:00",
    endDate: "2025-04-10T17:00:00",
    location: "Toronto, Canada",
    image: "/placeholder.svg",
    description: "Join inspiring talks from young leaders changing the world.",
  },
  {
    id: 6,
    title: "Sustainability Innovation Forum",
    date: "2025-06-20T09:30:00",
    location: "Stockholm, Sweden",
    image: "/placeholder.svg",
    description: "Explore sustainable business models and green technology.",
  },
  {
    id: 7,
    title: "Digital Nomad Summit",
    date: "2025-09-12T11:00:00",
    endDate: "2025-09-14T16:30:00",
    location: "Bali, Indonesia",
    image: "/placeholder.svg",
    description: "Network with remote entrepreneurs and freelancers from around the world.",
  }
];

export const EventSlider = () => {
  const today = new Date();
  const nextMonth = addMonths(today, 1);
  
  // Filter events to show only upcoming events within the next month
  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.date);
      return isAfter(eventDate, today) && isBefore(eventDate, nextMonth);
    })
    .slice(0, 3); // Limit to 3 events

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
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-secondary mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatEventDateRange(event.date, event.endDate)}</span>
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
            <p className="text-white text-lg">There are no upcoming events scheduled for the next month.</p>
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
