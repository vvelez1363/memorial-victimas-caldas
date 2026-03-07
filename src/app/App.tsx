import { useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "@/routes";
import { WelcomeScreen } from "@/components/welcome/WelcomeScreen";
import { AuthProvider } from "@/context/AuthContext";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <AuthProvider>
      {showWelcome ? (
        <WelcomeScreen onComplete={handleWelcomeComplete} />
      ) : (
        <RouterProvider router={router} />
      )}
    </AuthProvider>
  );
}
