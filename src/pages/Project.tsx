import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit2, Trash2, Download, Check, X, FileText, Eye, ExternalLink } from "lucide-react";
import { ProjectForm } from "@/components/ProjectForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: number;
  file: string;
  position: number;
  created_at: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  user_id: number;
  documents: Document[];
  author_name: string;
  formatted_date: string;
}

const Project = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: project, isLoading, error } = useQuery<Project>({
    queryKey: ['project', id],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You need to be a member to view this project');
        }
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!id && !!user
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
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

  const approveProjectMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/approve/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast({
        title: "Success",
        description: "Project approved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve project",
        variant: "destructive",
      });
    },
  });

  const rejectProjectMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/projects/${id}/reject/`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject project");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      toast({
        title: "Success",
        description: "Project rejected successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject project",
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

  const handleApproveProject = async () => {
    await approveProjectMutation.mutateAsync();
  };

  const handleRejectProject = async () => {
    await rejectProjectMutation.mutateAsync();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-white text-xl text-center">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">You need to be a member to view this project.</p>
          <Button 
            onClick={() => navigate('/support')} 
            className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
          >
            Become a Member
          </Button>
        </div>
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

  const canEdit = user && (user.id === project.user_id || user.user_type === 'admin');
  const isAdmin = user?.user_type === 'admin';
  const isPending = project.status === 'pending';

  const getFilenameFromUrl = (url: string) => {
    return url.split('/').pop() || 'Document';
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">{project.title}</h1>
        {canEdit && (
          <div className="flex gap-2">
            {isAdmin && isPending && (
              <>
                <Button 
                  variant="outline" 
                  className="gap-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={handleApproveProject}
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-white/80">Please provide a reason for rejecting this project:</p>
                      <textarea
                        className="w-full p-2 bg-[#1A1F2C] border border-[#1EAEDB]/20 text-white rounded-md"
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsRejectDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleRejectProject}
                          disabled={!rejectionReason.trim()}
                        >
                          Reject Project
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                  Edit Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <ProjectForm 
                  onSubmit={handleUpdateProject}
                  initialData={{
                    title: project.title,
                    description: project.description,
                    budget: project.budget,
                    documents: project.documents
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
          <div className="space-y-1">
            <span className={`${
              project.status === 'approved' ? 'text-green-500' :
              project.status === 'pending' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              Status: {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <p className="text-white/60 text-sm">Proposed by {project.author_name} on {project.formatted_date}</p>
          </div>
          <span className="text-white/60">Budget: {project.budget} CHF</span>
        </div>

        <div className="prose prose-invert">
          <p className="text-white/80 whitespace-pre-line">{project.description}</p>
        </div>

        {project.documents && project.documents.length > 0 && (
          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-[#1EAEDB]">Supporting Documents</h3>
            <div className="grid gap-4">
              {project.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-[#2A2F3C] rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#1EAEDB]" />
                    <span className="text-white/80">{getFilenameFromUrl(doc.file)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white"
                      onClick={() => window.open(doc.file, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.file;
                        link.download = getFilenameFromUrl(doc.file);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
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