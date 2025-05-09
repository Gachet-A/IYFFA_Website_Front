import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: string;
  user_id: number;
}

const Projects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/projects/');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return response.json();
    }
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
            className="bg-[#1A1F2C] rounded-lg p-6 hover:bg-[#2A2F3C] transition-colors cursor-pointer"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <h2 className="text-xl font-semibold text-[#1EAEDB] mb-2">{project.title}</h2>
            <p className="text-white/80 mb-4 line-clamp-3">{project.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-[#FEF7CD]">{project.status}</span>
              <span className="text-white/60">{project.budget} CHF</span>
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