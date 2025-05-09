import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText } from "lucide-react";
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
  author_name: string;
  formatted_date: string;
  documents: Document[];
}

const Projects = () => {
  const navigate = useNavigate();
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch('http://localhost:8000/api/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('You need to be a member to view projects');
        }
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    },
    enabled: !!user
  });

  const filteredProjects = projects?.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-white text-xl text-center">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-white/80 mb-6">You need to be a member to view and propose projects.</p>
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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">Projects</h1>
        {user && (
          <Button 
            variant="outline" 
            className="gap-2 border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white"
            onClick={() => navigate('/projects/new')}
          >
            <Plus className="w-4 h-4" />
            Propose Project
          </Button>
        )}
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10 bg-[#1A1F2C] border-[#1EAEDB]/20 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects?.map((project) => (
          <div 
            key={project.id} 
            className="bg-[#1A1F2C] rounded-lg p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-[#1EAEDB]">{project.title}</h3>
                  {project.documents && project.documents.length > 0 && (
                    <FileText className="w-4 h-4 text-[#1EAEDB]" />
                  )}
                </div>
                <p className="text-white/60 text-sm mt-1">Proposed by {project.author_name} on {project.formatted_date}</p>
              </div>
              <span className={`${
                project.status === 'approved' ? 'text-green-500' :
                project.status === 'pending' ? 'text-yellow-500' :
                'text-red-500'
              }`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
            </div>
            <p className="text-white/80 line-clamp-2">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-white/60">Budget: {project.budget} CHF</span>
              <Button
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">No projects found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Projects; 