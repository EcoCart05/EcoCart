import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface AnimatedAvatarProps {
  name?: string;
  email?: string;
  src?: string;
  size?: number;
}

/**
 * AnimatedAvatar: Modern avatar with fallback to initials, animated border, and optional remote avatar API.
 * Uses DiceBear for unique avatars if no photo is present.
 */
export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ name, email, src, size = 56 }) => {
  // Use DiceBear Avatars API for unique fallback if no src
  const dicebearUrl = React.useMemo(() => {
    const seed = email || name || "user";
    return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
  }, [email, name]);

  // Initials fallback
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email?.slice(0, 2).toUpperCase() || "U";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.07, boxShadow: "0 0 0 4px #6ee7b7" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-green-400 shadow-lg bg-white overflow-hidden"
    >
      <Avatar className="w-full h-full">
        {src ? (
          <AvatarImage src={src} alt={name || email || "avatar"} />
        ) : (
          <AvatarImage src={dicebearUrl} alt={name || email || "avatar"} />
        )}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </motion.div>
  );
};

export default AnimatedAvatar;
