import React, { useState, useEffect } from "react";
import LanguageSelector from '@/components/LanguageSelector';
import { getAllForumPosts, addForumPost, ForumPost } from "@/services/forumService";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

// ForumPost type is imported from forumService


const CommunityForum: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllForumPosts()
      .then(setPosts)
      .catch(() => setError("Failed to load forum posts."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please login to post.");
    setSubmitting(true);
    try {
      await addForumPost({ user: user.email || "Anonymous", content });
      setPosts((prev) => [...prev, { user: user.email || "Anonymous", content, createdAt: new Date() as any }]);
      setContent("");
    } catch (err) {
      setError("Failed to submit post.");
    }
    setSubmitting(false);
  };

  const forumData = {
    name: 'Community Forum',
    description: 'Ask questions, share tips, and connect with other eco-shoppers!',
    materials: ['Submit'],
    certifications: [],
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <LanguageSelector
        name={forumData.name}
        description={forumData.description}
        materials={forumData.materials}
        certifications={forumData.certifications}
      />
      <Card>
        <CardHeader>
          <CardTitle>{forumData.name}</CardTitle>
          <CardDescription>{forumData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading forum posts...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <ul className="mb-6">
              {posts.map((p, i) => (
                <li key={i} className="mb-2 border-b pb-2">
                  <b>{p.user}</b><br />
                  <span>{p.content}</span>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share a tip or ask a question..."
              required
              disabled={!user}
            />
            <Button type="submit" disabled={submitting || !user}>{submitting ? "Posting..." : "Post"}</Button>
            {!user && <div className="text-sm text-gray-500">Login to post in the forum.</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityForum;
