/*PARGE ARTICLES*/
/*Cette pages affichent tous les articles publiées par l'association*/

import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArticleForm } from "@/components/ArticleForm";

interface Article {
  id: number;
  title: string;
  text: string;
  formatted_date: string;
  author_name: string;
  author_title: string;
  user_id: number;
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  return lastSpaceIndex === -1 ? truncated + '...' : truncated.substring(0, lastSpaceIndex) + '...';
};

const Articles = () => {
  const { user, getToken } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch articles
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/articles/');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      return response.json();
    },
  });

  // Delete mutation
  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: number) => {
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");

      const response = await fetch(`http://localhost:8000/api/articles/${articleId}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete article");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  // Add create mutation
  const createArticleMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = await getToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch("http://localhost:8000/api/articles/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create article");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      });
    }
  });

  const handleDeleteArticle = async (articleId: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      await deleteArticleMutation.mutateAsync(articleId);
    }
  };

  const handleCreateArticle = async (formData: FormData) => {
    await createArticleMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p className="text-white text-xl">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#1EAEDB]">Latest Articles</h1>
        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/90">
                <Plus className="w-4 h-4 mr-2" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
              </DialogHeader>
              <ArticleForm onSubmit={handleCreateArticle} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {articles && articles.length > 0 ? (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
            <Card key={article.id} className="bg-[#1A1F2C] border-[#1EAEDB]/20">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB]">{article.title}</CardTitle>
                <CardDescription className="text-[#FEF7CD]">
                  Published on {article.formatted_date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white mb-4">{truncateText(article.text, 100)}</p>
                <Link to={`/article/${article.id}`} className="flex-1">
                  <Button variant="outline" className="w-full border-[#1EAEDB] text-[#1EAEDB] hover:bg-[#1EAEDB] hover:text-white">
                    Read More
                  </Button>
                </Link>
              </CardContent>
            </Card>
        ))}
      </div>
      ) : (
        <div className="text-center p-8 bg-[#1A1F2C] rounded-lg border border-[#1EAEDB]/20">
          <p className="text-white text-lg mb-4">No articles published yet.</p>
          {user && (
            <p className="text-white/60">
              Be the first to share an article with our community!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Articles;
