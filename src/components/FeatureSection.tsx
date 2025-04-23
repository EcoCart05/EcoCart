
import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({ icon, title, description }) => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 opacity-60 blur-lg group-hover:opacity-90 group-hover:blur-xl transition-all duration-500 animate-gradient-move z-0" />
      <Card className="relative z-10 text-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-2 border-transparent group-hover:border-green-400 group-hover:scale-[1.045] transition-all duration-400 shadow-xl rounded-3xl">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 dark:from-green-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center shadow-[0_0_32px_0_rgba(34,197,94,0.25)] group-hover:shadow-[0_0_64px_8px_rgba(34,197,94,0.45)] transition-shadow duration-400 animate-icon-glow">
              <span className="group-hover:animate-spin-slow transition-transform duration-500">{icon}</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-700 dark:text-gray-200 font-medium drop-shadow-sm">{description}</p>
        </CardContent>
      </Card>
      {/* Inline style for animation classes. This fixes the React/TypeScript JSX style error. */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 6s ease-in-out infinite;
        }
        @keyframes iconGlow {
          0%, 100% { box-shadow: 0 0 32px 0 rgba(34,197,94,0.25); }
          50% { box-shadow: 0 0 64px 8px rgba(34,197,94,0.45); }
        }
        .animate-icon-glow {
          animation: iconGlow 3s ease-in-out infinite;
        }
        @keyframes spinSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spinSlow 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default FeatureSection;
