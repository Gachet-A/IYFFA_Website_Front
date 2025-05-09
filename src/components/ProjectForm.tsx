import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { X, FileText } from "lucide-react";

interface Document {
  id: number;
  file: string;
  position: number;
  created_at: string;
}

interface ProjectFormProps {
  onSubmit: (projectData: FormData) => Promise<void>;
  initialData?: {
    title: string;
    description: string;
    budget: number;
    documents?: Document[];
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
  const [existingDocuments, setExistingDocuments] = useState<Document[]>(
    initialData?.documents || []
  );
  const [documentPositions, setDocumentPositions] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update existingDocuments when initialData changes
  useEffect(() => {
    if (initialData?.documents) {
      setExistingDocuments(initialData.documents);
    }
  }, [initialData]);

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

      // Add existing documents
      existingDocuments.forEach((doc) => {
        formData.append("existing_documents", doc.id.toString());
      });

      // Add new documents
      documents.forEach((doc, index) => {
        formData.append("documents", doc);
        formData.append("document_positions", (existingDocuments.length + index).toString());
      });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setDocuments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingDocument = (docId: number) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const getFilenameFromUrl = (url: string) => {
    return url.split('/').pop() || 'Document';
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documents">Supporting Documents</Label>
          <Input
            id="documents"
            type="file"
            multiple
            onChange={handleFileChange}
            className="bg-background"
          />
          <p className="text-sm text-white/60">
            Upload any supporting documents for your project proposal.
          </p>
        </div>

        {existingDocuments.length > 0 && (
          <div className="space-y-2">
            <Label>Existing Documents</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {existingDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 bg-[#2A2F3C] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1EAEDB]" />
                    <span className="text-white/80">{getFilenameFromUrl(doc.file)}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => removeExistingDocument(doc.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {documents.length > 0 && (
          <div className="space-y-2">
            <Label>New Documents to Upload</Label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              {documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-[#2A2F3C] rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1EAEDB]" />
                    <span className="text-white/80">{file.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={() => removeDocument(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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