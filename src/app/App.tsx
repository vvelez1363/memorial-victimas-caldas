// src/app/App.tsx

import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/routes";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthProvider } from "@/context/AuthContext";
import { MemoryPlacesProvider } from "@/app/context/MemoryPlacesContext";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <AuthProvider>
      <MemoryPlacesProvider>
        {showWelcome ? (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        ) : (
          <RouterProvider router={router} />
        )}
      </MemoryPlacesProvider>
    </AuthProvider>
  );
}
