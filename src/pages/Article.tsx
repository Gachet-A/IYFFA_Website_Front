/*PAGE D'UN ARTICLE*/
/*Cette page permettra d'afficher de manière dynamique un article en fonction de celui qui est séléctionné dans la page des ARTICLE */
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Les lignes ci-dessous sont à remplacer par l'appel à l'API qui permettra d'obtenir les données stocker en base de données
const fetchArticleDetails = async (id: string) => {
  // Voici les données temporaires 
  return {
    id,
    title: "Youth Leadership in Action",
    publishedDate: "March 15, 2024",
    content: `
      In recent years, we've witnessed an unprecedented surge in youth-led initiatives 
      that are reshaping communities worldwide. From environmental conservation to 
      social justice movements, young leaders are stepping up to address pressing 
      challenges facing our society.

      Through innovative approaches and leveraging digital platforms, these emerging 
      leaders are creating meaningful impact and inspiring others to join their cause. 
      Their work demonstrates the power of youth engagement in driving positive change.

      This article explores several successful case studies and provides insights into 
      the strategies employed by these young changemakers. We'll examine how they've 
      overcome challenges and what lessons can be learned from their experiences.
    `,
    author: {
      name: "Sarah Johnson",
      title: "Youth Program Director"
    }
  };
};

const Article = () => {
  const { id } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => fetchArticleDetails(id || ''),
    enabled: !!id
  });

  if (isLoading) return <div className="container mx-auto py-12 px-4">Loading...</div>;
  if (!article) return <div className="container mx-auto py-12 px-4">Article not found</div>;

  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <article className="prose prose-invert prose-lg mx-auto">
        <h1 className="text-4xl font-bold text-[#1EAEDB] mb-4">{article.title}</h1>
        <div className="text-[#FEF7CD] mb-8">Published on {article.publishedDate}</div>
        
        <div className="text-white/80 space-y-4 mb-12">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        
        <div className="border-t border-[#1EAEDB]/20 pt-6 mt-8">
          <p className="text-white text-right">
            By <span className="text-[#1EAEDB]">{article.author.name}</span>
            <br />
            <span className="text-white/60">{article.author.title}</span>
          </p>
        </div>
      </article>
    </div>
  );
};

export default Article;
