/*PAGE EVENT*/
/*Cette page permet d'afficher un Event proposer par l'association*/

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Calendar, DollarSign, Ticket, ZoomIn, Edit2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatEventDate, formatEventDateRange } from "@/lib/dateUtils";
import { EventForm } from "@/components/EventForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

//récupération des détails de l'évènement 
const fetchEventDetails = async (id: string) => {
  const response = await fetch(`http://localhost:8000/api/events/${id}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch event details");
  }
  return response.json();
};

interface EventDetails {
  eve_id: number;
  eve_title: string;
  eve_description: string;
  eve_start_datetime: string;
  eve_end_datetime: string;
  eve_location: string;
  eve_price: number;
  formatted_start_date: string;
  formatted_end_date: string;
  eve_ticket_url?: string;
  images?: { img_url: string }[];
}

const Event = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: event, isLoading } = useQuery<EventDetails>({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id || ''),
    enabled: !!id
  });

  const updateEventMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/events/${id}/`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const handleUpdateEvent = async (formData: FormData) => {
    await updateEventMutation.mutateAsync(formData);
  };

  //gestion de l'affichage lorsque les recherches chargent ou que les recherches n'ont pas encore été trouvé
  if (isLoading) return <div className="container mx-auto py-12 px-4">Loading...</div>;
  if (!event) return <div className="container mx-auto py-12 px-4">Event not found</div>;

  //affichage de google map pour le lieu de l'évenement
  const handleGoogleMapsClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.eve_location)}`,
      '_blank'
    );
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1EAEDB]">{event.eve_title}</h1>
        {user && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Event</DialogTitle>
              </DialogHeader>
              <EventForm 
                onSubmit={handleUpdateEvent}
                initialData={{
                  title: event.eve_title,
                  description: event.eve_description,
                  location: event.eve_location,
                  price: event.eve_price,
                  eve_start_datetime: event.eve_start_datetime,
                  eve_end_datetime: event.eve_end_datetime,
                  startTime: new Date(event.eve_start_datetime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
                  endTime: event.eve_end_datetime ? new Date(event.eve_end_datetime).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : '',
                }}
                isEditing={true}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full relative" opts={{ loop: true }}>
            <CarouselContent>
              {event.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <img
                          src={image.img_url}
                          alt={`${event.eve_title} - Image ${index + 1}`}
                          className="w-full h-[400px] object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ZoomIn className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <Carousel opts={{ loop: true }}>
                        <CarouselContent>
                          {event.images.map((img, idx) => (
                            <CarouselItem key={idx}>
                              <img
                                src={img.img_url}
                                alt={`${event.eve_title} - Image ${idx + 1}`}
                                className="w-full h-auto"
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 h-12 w-12" />
                        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 h-12 w-12" />
                      </Carousel>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 h-12 w-12" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 h-12 w-12" />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-[#1EAEDB]" />
            <span>{formatEventDateRange(event.eve_start_datetime, event.eve_end_datetime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={handleGoogleMapsClick}>
            <MapPin className="w-5 h-5 text-[#1EAEDB]" />
            <span className="hover:underline">{event.eve_location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-[#1EAEDB]" />
            <span>${event.eve_price}</span>
          </div>
          
          <p className="text-white/80">{event.eve_description}</p>
          
          <Button 
            className="w-full md:w-auto bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 gap-2"
            onClick={() => window.open(event.eve_ticket_url, '_blank')}
          >
            <Ticket className="w-4 h-4" />
            Get Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Event;
