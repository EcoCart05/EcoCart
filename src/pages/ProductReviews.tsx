import React, { useState, useEffect } from "react";
import LanguageSelector from '@/components/LanguageSelector';
import { getAllReviews, addReview, Review as ReviewType } from "@/services/reviewService";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

// Review type is imported from reviewService


const ProductReviews: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllReviews()
      .then(setReviews)
      .catch(() => setError("Failed to load reviews."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Please login to leave a review.");
    setSubmitting(true);
    try {
      await addReview({ user: user.email || "Anonymous", rating, comment });
      setReviews((prev) => [...prev, { user: user.email || "Anonymous", rating, comment, createdAt: new Date() as any }]);
      setComment("");
      setRating(5);
    } catch (err) {
      setError("Failed to submit review.");
    }
    setSubmitting(false);
  };

  const reviewsData = {
    name: 'Product Reviews',
    description: 'Share your experience and help others make eco-friendly choices!',
    materials: ['Submit Review'],
    certifications: [],
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <LanguageSelector
        name={reviewsData.name}
        description={reviewsData.description}
        materials={reviewsData.materials}
        certifications={reviewsData.certifications}
      />
      <Card>
        <CardHeader>
          <CardTitle>{reviewsData.name}</CardTitle>
          <CardDescription>{reviewsData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-400 text-center py-8">Loading reviews...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <ul className="mb-6">
              {reviews.map((r, i) => (
                <li key={i} className="mb-2 border-b pb-2">
                  <b>{r.user}</b> - {"★".repeat(r.rating)}<br />
                  <span>{r.comment}</span>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label>
              Rating:
              <select value={rating} onChange={e => setRating(Number(e.target.value))} className="ml-2">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write your review..."
              required
              disabled={!user}
            />
            <Button type="submit" disabled={submitting || !user}>{submitting ? "Submitting..." : "Submit Review"}</Button>
            {!user && <div className="text-sm text-gray-500">Login to submit a review.</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
