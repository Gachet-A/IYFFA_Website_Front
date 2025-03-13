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
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData?.start_datetime ? new Date(initialData.start_datetime) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData?.end_datetime ? new Date(initialData.end_datetime) : undefined
  );
  const [startTime, setStartTime] = useState(
    initialData?.start_datetime ? format(new Date(initialData.start_datetime), "HH:mm") : ""
  );
  const [endTime, setEndTime] = useState(
    initialData?.end_datetime ? format(new Date(initialData.end_datetime), "HH:mm") : ""
  );
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

    if (!startDate || !startTime) {
      toast({
        title: "Required Fields",
        description: "Please select both start date and time.",
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

      // Combine date and time for start datetime
      const startDateTime = new Date(startDate);
      const [startHours, startMinutes] = startTime.split(":");
      startDateTime.setHours(parseInt(startHours), parseInt(startMinutes));
      formData.append("start_datetime", startDateTime.toISOString());

      // Only append end datetime if both date and time are set
      if (endDate && endTime) {
        const endDateTime = new Date(endDate);
        const [endHours, endMinutes] = endTime.split(":");
        endDateTime.setHours(parseInt(endHours), parseInt(endMinutes));
        formData.append("end_datetime", endDateTime.toISOString());
      } else {
        formData.append("end_datetime", ""); // Send empty string to indicate no end date
      }

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

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date);
    if (!date) {
      setEndTime(""); // Clear end time when date is cleared
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    if (!newTime) {
      setEndDate(undefined); // Clear end date when time is cleared
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
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd.MM.yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              className="w-24 text-white bg-background [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <div className="flex gap-2">
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
                  {endDate ? format(endDate, "dd.MM.yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="w-24 text-white bg-background [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
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