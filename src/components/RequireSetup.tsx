import { Navigate, useLocation } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { ReactNode } from "react";

/**
 * Auth + onboarding gate.
 * - Not logged in   -> /login
 * - Logged in but onboarding incomplete -> /welcome
 */
export const RequireSetup = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();
  const loc = useLocation();
  if (!settings.loggedIn) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (!settings.onboardingComplete) return <Navigate to="/welcome" replace />;
  return <>{children}</>;
};
