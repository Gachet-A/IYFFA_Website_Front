/*PAGES EVENTS*/
/*Cette page affiche tous les évènements de l'association*/

import { useState } from "react";
import { Search, Calendar, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/DatePicker";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isBefore } from "date-fns";
import { formatEventDateRange, isPastEvent } from "@/lib/dateUtils";

//Liste des Events proposé par l'association
const events = [
  {
    id: 1,
    title: "Global Youth Entrepreneurship Summit",
    date: "2024-06-15",
    endDate: "2024-06-17",
    location: "New York, USA",
    image: "/placeholder.svg",
    description: "Connect with young entrepreneurs from over 50 countries.",
  },
  {
    id: 2,
    title: "Future Founders Workshop Series",
    date: "2024-07-22",
    endDate: "2024-07-25",
    location: "London, UK",
    image: "/placeholder.svg",
    description: "Learn from successful founders and industry experts.",
  },
  {
    id: 3,
    title: "Innovation Challenge 2024",
    date: "2024-08-10",
    location: "Singapore",
    image: "/placeholder.svg",
    description: "Pitch your ideas and win funding for your startup.",
  },
  {
    id: 4,
    title: "Tech for Good Hackathon",
    date: "2025-02-15",
    endDate: "2025-02-17",
    location: "Berlin, Germany",
    image: "/placeholder.svg",
    description: "Develop solutions for pressing social and environmental challenges.",
  },
  {
    id: 5,
    title: "Young Leaders Conference",
    date: "2025-04-08",
    endDate: "2025-04-10",
    location: "Toronto, Canada",
    image: "/placeholder.svg",
    description: "Join inspiring talks from young leaders changing the world.",
  },
  {
    id: 6,
    title: "Sustainability Innovation Forum",
    date: "2025-06-20",
    location: "Stockholm, Sweden",
    image: "/placeholder.svg",
    description: "Explore sustainable business models and green technology.",
  },
  {
    id: 7,
    title: "Digital Nomad Summit",
    date: "2025-09-12",
    endDate: "2025-09-14",
    location: "Bali, Indonesia",
    image: "/placeholder.svg",
    description: "Network with remote entrepreneurs and freelancers from around the world.",
  },
  // Ajout d'un Event passé pour tester le filtre
  {
    id: 8,
    title: "Past Entrepreneurship Workshop",
    date: "2023-11-05",
    location: "Paris, France",
    image: "/placeholder.svg",
    description: "A past workshop that should only show up when specifically selected.",
  }
];


const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [includePastEvents, setIncludePastEvents] = useState(false);

  const handleDateSelect = (dates: Date[] | Date | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    
    if (Array.isArray(dates)) {
      setSelectedDates(dates);
      // Si l'utilisateur séléctionnes des dates qui incluent des évenements passées, cela les montrera
      setIncludePastEvents(true);
    } else {
      // Si une seule date est choisie, elle aura besoin d'être spécialement géré
      const dateExists = selectedDates.some(
        selectedDate => selectedDate.toDateString() === dates.toDateString()
      );

      //Vérifie la validité de la date
      if (dateExists) {
        const newSelectedDates = selectedDates.filter(
          selectedDate => selectedDate.toDateString() !== dates.toDateString()
        );
        setSelectedDates(newSelectedDates);
        
        // S'il n'y a plus de date sélectionné, on revient à montrer les futurs évenements
        if (newSelectedDates.length === 0) {
          setIncludePastEvents(false);
        }
      } else {
        setSelectedDates([...selectedDates, dates]);
        // Si l'utilisateur choisi des dates, nous incluerons les évenements passées dans ces dates
        setIncludePastEvents(true);
      }
    }
  };

  const removeDateFilter = (dateToRemove: Date) => {
    const newSelectedDates = selectedDates.filter(
      date => date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(newSelectedDates);

    //Si aucune date n'est sélectionné, on affiche de nouveau seulement les évenements futur
    if (newSelectedDates.length === 0) {
      setIncludePastEvents(false);
    }
  };

  //permet de supprimer tous les filtres
  const clearAllDateFilters = () => {
    setSelectedDates([]);
    setIncludePastEvents(false);
  };

  const filteredEvents = events.filter((event) => {
    // Permet de gérer le texte pour la recherche filtré
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    //Le filtre des évènements passées - inclu seulement des évènements passées si incluePastEvents retourne true
    if (!includePastEvents && isPastEvent(event.date)) {
      return false;
    }

    // filtre de sélection de la date
    if (selectedDates.length === 0) return matchesSearch;

    //vérifie que la date de l'event correspond aux dates sélectionnées
    const eventDate = new Date(event.date);
    const matchesDate = selectedDates.some(
      selectedDate => selectedDate.toDateString() === eventDate.toDateString()
    );
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          Upcoming Events
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search events by name, location ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          </div>
          
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter by Date
                {selectedDates.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedDates.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4" align="end">
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium">Select multiple dates:</p>
                <DatePicker
                  multiSelect={true}
                  selectedDates={selectedDates}
                  onSelect={handleDateSelect}
                />
              </div>
              
              {selectedDates.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium">Selected dates:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllDateFilters}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {format(date, "MMM d, yyyy")}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeDateFilter(date)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-[#1A1F2C] border-primary">
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
                    <h3 className="text-xl font-semibold mb-2 text-primary">
                      {event.title}
                    </h3>
                    <p className="text-white mb-2">{event.location}</p>
                    <p className="text-white mb-4">{event.description}</p>
                    <Link to={`/event/${event.id}`}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
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
            <p className="text-white text-lg">There are no upcoming events matching your search or filter criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white"
              onClick={() => {
                setSearchTerm("");
                setSelectedDates([]);
                setIncludePastEvents(false);
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
