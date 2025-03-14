/*PAGE D'UN ARTICLE*/
/*Cette page permettra d'afficher de manière dynamique un article en fonction de celui qui est séléctionné dans la page des ARTICLE */
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
import { Edit2, Trash2 } from "lucide-react";
import { ArticleForm } from "@/components/ArticleForm";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface Article {
  id: number;
  title: string;
  text: string;
  formatted_date: string;
  author_name: string;
  author_title: string;
  user_id: number;
}

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ['article', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/articles/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      return response.json();
    },
    enabled: !!id
  });

  const updateArticleMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/articles/${id}/`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to update article");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article", id] });
      setIsEditDialogOpen(false);
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update article",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`http://localhost:8000/api/articles/${id}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
    },
    onSuccess: () => {
      navigate('/articles');
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const handleUpdateArticle = async (formData: FormData) => {
    await updateArticleMutation.mutateAsync(formData);
  };

  const handleDeleteArticle = async () => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteArticleMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <p className="text-white text-xl text-center">Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Article Not Found</h1>
          <Button onClick={() => navigate('/articles')} className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
            Return to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">{article.title}</h1>
        {user && (user.id === article.user_id || user.user_type === 'admin') && (
          <div className="flex gap-2">
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white">
                  <Edit2 className="w-4 h-4" />
                  Edit Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Article</DialogTitle>
                </DialogHeader>
                <ArticleForm 
                  onSubmit={handleUpdateArticle}
                  initialData={{
                    title: article.title,
                    text: article.text,
                  }}
                  isEditing={true}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={handleDeleteArticle}
              disabled={deleteArticleMutation.isPending}
            >
              <Trash2 className="w-4 h-4" />
              {deleteArticleMutation.isPending ? "Deleting..." : "Delete Article"}
            </Button>
          </div>
        )}
      </div>

      <article className="prose prose-invert prose-lg mx-auto">
        <div className="text-[#FEF7CD] mb-8">Published on {article.formatted_date}</div>
        
        <div className="text-white/80 space-y-4 mb-12">
          {article.text.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className="border-t border-[#1EAEDB]/20 pt-6 mt-8">
          <p className="text-white text-right">
            By <span className="text-[#1EAEDB]">{article.author_name}</span>
            <br />
            <span className="text-white/60">{article.author_title}</span>
          </p>
        </div>
      </article>
    </div>
  );
};

export default Article;
