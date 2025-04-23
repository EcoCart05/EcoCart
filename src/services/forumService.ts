import { getFirestore, collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";

const db = getFirestore();
const POSTS_COLLECTION = "forum_posts";

export interface ForumPost {
  user: string;
  content: string;
  createdAt: Timestamp;
}

export async function getAllForumPosts(): Promise<ForumPost[]> {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as ForumPost);
}

export async function addForumPost(post: Omit<ForumPost, "createdAt">) {
  await addDoc(collection(db, POSTS_COLLECTION), {
    ...post,
    createdAt: Timestamp.now(),
  });
}
