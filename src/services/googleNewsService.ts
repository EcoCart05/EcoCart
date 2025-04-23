// Service to fetch eco-friendly news articles using Google Custom Search API
// NOTE: For production, secure your API key and restrict usage in Google Cloud Console.

const API_KEY = "AIzaSyD6o1kvbi3q2uuPizShbwTBlLUPV2ZhgX0";
const CX = "86b06f5b16b464652"; // Your Custom Search Engine ID
const QUERY = "eco-friendly daily news updates";

export interface NewsArticle {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
  date?: string;
}

export async function fetchEcoNewsArticles(): Promise<NewsArticle[]> {
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(QUERY)}&sort=date&num=10`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch news articles");
  const data = await response.json();
  if (!data.items) return [];
  return data.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    snippet: item.snippet,
    displayLink: item.displayLink,
    date: item.pagemap?.metatags?.[0]?.['article:published_time'] || undefined,
  }));
}
