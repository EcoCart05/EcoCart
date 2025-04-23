import { getFirestore, collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";

const db = getFirestore();
const REVIEWS_COLLECTION = "reviews";

export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, REVIEWS_COLLECTION), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Review);
}

export async function addReview(review: Omit<Review, "createdAt">) {
  await addDoc(collection(db, REVIEWS_COLLECTION), {
    ...review,
    createdAt: Timestamp.now(),
  });
}
