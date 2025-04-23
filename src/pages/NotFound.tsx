import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HomeIcon, ArrowLeft } from "lucide-react";

const NotFound = () => {
  // NotFound component removed as per user request.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-4">
      <div className="text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
