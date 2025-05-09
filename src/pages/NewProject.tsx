import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { ProjectForm } from "@/components/ProjectForm";

const NewProject = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const createProjectMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("http://localhost:8000/api/projects/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project created successfully",
      });
      navigate('/projects');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (formData: FormData) => {
    await createProjectMutation.mutateAsync(formData);
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">Propose a New Project</h1>
      </div>

      <div className="bg-[#1A1F2C] rounded-lg p-6">
        <ProjectForm 
          onSubmit={handleSubmit}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default NewProject; 