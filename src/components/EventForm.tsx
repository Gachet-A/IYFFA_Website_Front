import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface EventFormProps {
  onSubmit: (eventData: FormData) => Promise<void>;
  initialData?: any;
  isEditing?: boolean;
}

export const EventForm = ({ onSubmit, initialData, isEditing = false }: EventFormProps) => {
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [price, setPrice] = useState(initialData?.price || "");
  const [date, setDate] = useState<Date | undefined>(initialData?.date ? new Date(initialData.date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(initialData?.endDate ? new Date(initialData.endDate) : undefined);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create or edit events.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("price", price);
      if (date) formData.append("date", date.toISOString().split('T')[0]);
      
      // Add images if any
      if (images.length > 0) {
        images.forEach((image, index) => {
          formData.append('images', image);
          formData.append('image_positions', index.toString());
        });
      }

      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      await onSubmit(formData);
      
      toast({
        title: isEditing ? "Event Updated" : "Event Created",
        description: `Successfully ${isEditing ? 'updated' : 'created'} the event.`,
      });
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: "Failed to submit event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="images">Event Images</Label>
        <Input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required={!isEditing}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : isEditing ? "Update Event" : "Create Event"}
      </Button>
    </form>
  );
}; 