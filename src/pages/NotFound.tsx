import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
      <div className="text-6xl mb-4">🐾</div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">Oops! Looks like your pet wandered off.</p>
      <Button asChild>
        <Link to="/">Return to PetPal</Link>
      </Button>
    </div>
  );
};

export default NotFound;