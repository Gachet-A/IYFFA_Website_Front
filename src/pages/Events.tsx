/*PAGES EVENTS*/
/*Cette page affiche tous les évènements de l'association*/

import { useState } from "react";
import { Search, Calendar, Filter, X, Plus } from "lucide-react";
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
import { EventForm } from "@/components/EventForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

// Add interface for Event type
interface Event {
  eve_id: number;
  eve_title: string;
  eve_description: string;
  eve_start_datetime: string;
  eve_end_datetime: string;
  eve_location: string;
  eve_price: number;
  formatted_start_date: string;
  formatted_end_date: string;
  images?: { img_url: string }[];
}

const Events = () => {
  console.log("Events component rendering"); // Debug log at the start

  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State hooks should be grouped together
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [includePastEvents, setIncludePastEvents] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query hook with proper typing
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      console.log("Fetching events..."); // Debug log
      try {
        const response = await fetch('http://localhost:8000/api/events/');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          throw new Error(`Failed to fetch events: ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Events fetched successfully:", data); // Debug log
        return data;
      } catch (err) {
        console.error('Fetch error:', err);
        throw err;
      }
    },
    retry: false,
  });

  // Mutation hook
  const createEventMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      // Log the form data for debugging
      console.log("Form data being sent:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch("http://localhost:8000/api/events/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(errorData.error || "Failed to create event");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  });

  // Event handlers
  const handleCreateEvent = async (formData: FormData) => {
    await createEventMutation.mutateAsync(formData);
  };

  const handleDateSelect = (dates: Date[] | Date | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    
    if (Array.isArray(dates)) {
      setSelectedDates(dates);
      setIncludePastEvents(true);
    } else {
      const dateExists = selectedDates.some(
        selectedDate => selectedDate.toDateString() === dates.toDateString()
      );

      if (dateExists) {
        const newSelectedDates = selectedDates.filter(
          selectedDate => selectedDate.toDateString() !== dates.toDateString()
        );
        setSelectedDates(newSelectedDates);
        
        if (newSelectedDates.length === 0) {
          setIncludePastEvents(false);
        }
      } else {
        setSelectedDates([...selectedDates, dates]);
        setIncludePastEvents(true);
      }
    }
  };

  const removeDateFilter = (dateToRemove: Date) => {
    const newSelectedDates = selectedDates.filter(
      date => date.toDateString() !== dateToRemove.toDateString()
    );
    setSelectedDates(newSelectedDates);

    if (newSelectedDates.length === 0) {
      setIncludePastEvents(false);
    }
  };

  const clearAllDateFilters = () => {
    setSelectedDates([]);
    setIncludePastEvents(false);
  };

  // Filtering logic with null checks
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.eve_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eve_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eve_description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!includePastEvents && event.formatted_start_date && isPastEvent(event.formatted_start_date)) {
      return false;
    }

    if (selectedDates.length === 0) return matchesSearch;

    if (!event.formatted_start_date) return false;

    const eventDate = new Date(event.formatted_start_date);
    const matchesDate = selectedDates.some(
      selectedDate => selectedDate.toDateString() === eventDate.toDateString()
    );
    
    return matchesSearch && matchesDate;
  });

  // Error and loading states
  if (error) {
    console.error('Error in Events component:', error);
    return (
      <div className="min-h-screen bg-[#020817] p-8">
        <div className="container mx-auto text-center">
          <p className="text-red-500 mb-4">Error loading events: {error.message}</p>
          <pre className="text-white text-sm overflow-auto max-w-2xl mx-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (isLoading) {
    console.log("Events component in loading state");
    return (
      <div className="min-h-screen bg-[#020817] p-8">
        <div className="container mx-auto text-center">
          <p className="text-white text-xl">Loading events...</p>
          <div className="mt-4 text-[#1EAEDB]">Please wait while we fetch the events...</div>
        </div>
      </div>
    );
  }

  console.log("Events data:", events);

  // Main render
  return (
    <div className="min-h-screen bg-[#020817]">
      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#1EAEDB]">
            Upcoming Events
          </h1>
          {user && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>
                <EventForm onSubmit={handleCreateEvent} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search events by name, location ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 text-white"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          </div>
          
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 border-[#1EAEDB] text-[#1EAEDB]">
                <Filter className="h-4 w-4" />
                Filter by Date
                {selectedDates.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedDates.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 bg-[#1A1F2C]" align="end">
              <div className="mb-4 space-y-2">
                <p className="text-sm font-medium text-white">Select multiple dates:</p>
                <DatePicker
                  multiSelect={true}
                  selectedDates={selectedDates}
                  onSelect={handleDateSelect}
                />
              </div>
              
              {selectedDates.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-white">Selected dates:</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllDateFilters}
                      className="h-auto py-1 px-2 text-xs text-[#1EAEDB] hover:text-white"
                    >
                      Clear all
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1 border-[#1EAEDB] text-[#1EAEDB]">
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
              <Card key={event.eve_id} className="overflow-hidden hover:shadow-lg transition-shadow bg-[#1A1F2C] border-[#1EAEDB]">
                <CardContent className="p-0">
                  <img
                    src={event.images?.[0]?.img_url || "/placeholder.svg"}
                    alt={event.eve_title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-[#1EAEDB] mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {formatEventDateRange(event.eve_start_datetime, event.eve_end_datetime)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-[#1EAEDB]">
                      {event.eve_title}
                    </h3>
                    <p className="text-white/80 mb-2">{event.eve_location}</p>
                    <p className="text-white/60 mb-4 line-clamp-2">{event.eve_description}</p>
                    <Link to={`/event/${event.eve_id}`}>
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
            <p className="text-white text-lg">No events found matching your criteria.</p>
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
