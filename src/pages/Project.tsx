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
import { Edit2, Trash2, Download } from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  user_id: number;
  documents?: { url: string }[];
}

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/projects/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!id
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to update project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      navigate('/projects');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleUpdateProject = async (formData: FormData) => {
    await updateProjectMutation.mutateAsync(formData);
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProjectMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-white text-xl text-center">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/projects')} className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
            Return to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">{project.title}</h1>
        {user && (user.id === project.user_id || user.user_type === 'admin') && (
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                  Edit Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <ProjectForm 
                  onSubmit={handleUpdateProject}
                  initialData={{
                    title: project.title,
                    description: project.description,
                    budget: project.budget,
                  }}
                  isEditing={true}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={handleDeleteProject}
              disabled={deleteProjectMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
            </Button>
          </div>
        )}
      </div>

      <div className="bg-[#1A1F2C] rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-[#FEF7CD]">Status: {project.status}</span>
          <span className="text-white/60">Budget: {project.budget} CHF</span>
        </div>

        <div className="prose prose-invert">
          <p className="text-white/80 whitespace-pre-line">{project.description}</p>
        </div>

        {project.documents && project.documents.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#1EAEDB]">Supporting Documents</h3>
            <div className="grid gap-4">
              {project.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#2A2F3C] rounded-lg">
                  <span className="text-white/80">{doc.url.split('/').pop()}</span>
                  <Button
                    variant="outline"
                    className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Project; 