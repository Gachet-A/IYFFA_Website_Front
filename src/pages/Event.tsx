
/*PAGE EVENT*/
/*Cette page permet d'afficher un Event proposer par l'association*/

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Calendar, DollarSign, Ticket, ZoomIn } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { formatEventDate } from "@/lib/dateUtils";

//récupération des détails de l'évènement 
//les données ci-dessous sont des temporaires 
const fetchEventDetails = async (id: string) => {
  return {
    id,
    title: "Global Youth Entrepreneurship Summit",
    date: "2024-06-15T09:00:00",
    endDate: "2024-06-17T17:00:00",
    location: {
      address: "123 Innovation Street, New York, NY 10001",
      coordinates: "40.7128,-74.0060"
    },
    price: 299,
    ticketUrl: "https://example-ticket-vendor.com",
    images: [
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
    ],
    description: "Connect with young entrepreneurs from over 50 countries in this transformative three-day summit."
  };
};

const Event = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id || ''),
    enabled: !!id
  });

  //gestion de l'affichage lorsque les recherches chargent ou que les recherches n'ont pas encore été trouvé
  if (isLoading) return <div className="container mx-auto py-12 px-4">Loading...</div>;
  if (!event) return <div className="container mx-auto py-12 px-4">Event not found</div>;

  //affichage de google map pour le lieu de l'évenement
  const handleGoogleMapsClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.address)}`,
      '_blank'
    );
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full relative" opts={{ loop: true }}>
            <CarouselContent>
              {event.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer">
                        <img
                          src={image}
                          alt={`${event.title} - Image ${index + 1}`}
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
                                src={img}
                                alt={`${event.title} - Image ${idx + 1}`}
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
          <h1 className="text-3xl font-bold text-[#1EAEDB]">{event.title}</h1>
          
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-[#1EAEDB]" />
            <span>{formatEventDate(event.date, event.endDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={handleGoogleMapsClick}>
            <MapPin className="w-5 h-5 text-[#1EAEDB]" />
            <span className="hover:underline">{event.location.address}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <DollarSign className="w-5 h-5 text-[#1EAEDB]" />
            <span>${event.price}</span>
          </div>
          
          <p className="text-white/80">{event.description}</p>
          
          <Button 
            className="w-full md:w-auto bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 gap-2"
            onClick={() => window.open(event.ticketUrl, '_blank')}
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
