import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import AnimatedAvatar from "@/components/AnimatedAvatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserBadges, EcoBadgeType } from "@/services/userBadges";
import EcoBadge from "@/components/EcoBadge";

const userProfileData = {
  name: 'User Profile',
  description: '',
  materials: ['Download Profile', 'Delete Profile'],
  certifications: [],
};

const UserProfile: React.FC = () => {
  const [darkMode, handleDarkModeToggle] = useDarkMode();
  const { user, logout } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const [badges, setBadges] = useState<EcoBadgeType[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    // Fetch user badges
    setLoadingBadges(true);
    getUserBadges(user.uid)
      .then(res => setBadges(res.badges))
      .finally(() => setLoadingBadges(false));
  }, [user, navigate]);

  const handleDownload = async () => {
    setDownloading(true);
    const data = {
      email: user?.email,
      uid: user?.uid,
      // Add more user data here
    };
    const jsPDF = (await import('jspdf')).jsPDF;
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('EcoCart User Data', 10, 10);
    let y = 20;
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${value ?? ''}`, 10, y);
      y += 10;
    });
    doc.save(`ecocart-profile-${user?.uid}.pdf`);
    setDownloading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    // TODO: Add backend deletion logic
    alert("Your data deletion request has been received. (Implement backend logic for real deletion.)");
    setDeleting(false);
    logout();
  };

  if (!user) return <div className="p-8">Please log in to view your profile.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 24 }}
      className="flex justify-center py-10"
    >
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex flex-col items-center gap-2 pb-2">
            <AnimatedAvatar
              name={user.displayName || undefined}
              email={user.email || undefined}
              src={user.photoURL || undefined}
              size={80}
            />
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-lg text-green-700">{user.displayName || user.email}</span>
              <Button
                variant="outline"
                size="icon"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                onClick={handleDarkModeToggle}
              >
                {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-800" />}
              </Button>
            </div>
            <span className="text-gray-500 text-xs">{user.email}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4"><b>UID:</b> {user.uid}</div>


        </CardContent>
        <CardFooter className="flex gap-4">
          <Button onClick={handleDownload} disabled={downloading}>
            {downloading ? "Downloading..." : "Download My Data"}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete My Account"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
