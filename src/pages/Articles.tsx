/*PARGE ARTICLES*/
/*Cette pages affichent tous les articles publiées par l'association*/

import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex === -1) return truncated + '...';
  
  return truncated.substring(0, lastSpaceIndex) + '...';
};

//C'est dans cette variable que l'on récupère tous les articles stockés en base de données afin de les afficher
const articles = [
  {
    id: 1,
    title: "Youth Leadership in Action",
    date: "March 15, 2024",
    content: "Exploring how young leaders are making a difference in their communities through innovative social projects. These leaders are implementing creative solutions to address local challenges and inspiring others to join their efforts."
  },
  {
    id: 2,
    title: "Future of Youth Advocacy",
    date: "March 10, 2024",
    content: "Insights into emerging trends in youth advocacy and social change movements. Young advocates are leveraging digital platforms and global networks to amplify their voices and drive meaningful policy changes."
  },
  {
    id: 3,
    title: "Community Impact Stories",
    date: "March 5, 2024",
    content: "Success stories from our youth-led initiatives making real changes in communities. These inspiring examples showcase the transformative power of youth engagement and demonstrate how small actions can lead to significant community impact."
  }
];

const Articles = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl text-center font-bold text-[#1EAEDB] mb-8">Latest Articles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(article => (
          <Link to={`/article/${article.id}`} key={article.id}>
            <Card className="bg-[#1A1F2C] border-[#1EAEDB]/20 transition-transform hover:scale-105">
              <CardHeader>
                <CardTitle className="text-[#1EAEDB]">{article.title}</CardTitle>
                <CardDescription className="text-[#FEF7CD]">Published on {article.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-white">{truncateText(article.content, 100)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Articles;
