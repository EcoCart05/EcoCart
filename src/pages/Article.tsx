import React, { useEffect, useState } from "react";
import { fetchEcoNewsArticles, NewsArticle } from "@/services/googleNewsService";


const Article: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchEcoNewsArticles()
      .then(setArticles)
      .catch(() => setError("Failed to fetch news articles. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Eco-Friendly News & Articles</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <ul className="space-y-6">
        {articles.map((article, idx) => (
          <li key={idx} className="border rounded p-4 shadow bg-white dark:bg-gray-800">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-green-700 hover:underline">
              {article.title}
            </a>
            <div className="text-sm text-gray-500">{article.displayLink}{article.date ? ` • ${new Date(article.date).toLocaleDateString()}` : ""}</div>
            <p className="mt-2 text-gray-700 dark:text-gray-200">{article.snippet}</p>
          </li>
        ))}
      </ul>
      <hr className="my-10" />
      
    </div>
  );
};

export default Article;
