import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface ArticleFormProps {
  onSubmit: (articleData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    text: string;
  };
  isEditing?: boolean;
}

export const ArticleForm = ({ onSubmit, initialData, isEditing = false }: ArticleFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [text, setText] = useState(initialData?.text || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create or edit articles.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !text.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting article:", error);
      toast({
        title: "Error",
        description: "Failed to submit article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Article Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text">Content</Label>
        <Textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="min-h-[200px] bg-background"
        />
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
      >
        {isSubmitting ? "Submitting..." : isEditing ? "Update Article" : "Create Article"}
      </Button>
    </form>
  );
}; 