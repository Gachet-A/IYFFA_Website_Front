import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface ProjectFormProps {
  onSubmit: (projectData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    budget: number;
  };
  isEditing?: boolean;
}

export const ProjectForm = ({ onSubmit, initialData, isEditing = false }: ProjectFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [budget, setBudget] = useState(initialData?.budget?.toString() || "");
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create or edit projects.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !description.trim() || !budget.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("budget", budget);

      // Add documents if any
      if (documents.length > 0) {
        documents.forEach((file, index) => {
          formData.append('documents', file);
          formData.append('document_positions', index.toString());
        });
      }

      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting project:", error);
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="min-h-[200px] bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget (CHF)</Label>
        <Input
          id="budget"
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
          min="0"
          step="0.01"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="documents">Supporting Documents (Optional)</Label>
        <Input
          id="documents"
          type="file"
          multiple
          onChange={handleDocumentChange}
          className="bg-background"
        />
        <p className="text-sm text-white/60">
          Upload any supporting documents for your project proposal.
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
      >
        {isSubmitting ? "Submitting..." : isEditing ? "Update Project" : "Propose Project"}
      </Button>
    </form>
  );
}; 