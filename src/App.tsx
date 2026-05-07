import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { RequireSetup } from "@/components/RequireSetup";
import { FullscreenLoader } from "@/components/Loader";

// Lazy-load every page so route transitions show a real loading state
// while the chunk + any data the page needs are fetched.
const Index = lazy(() => import("./pages/Index.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Welcome = lazy(() => import("./pages/Welcome.tsx"));
const Student = lazy(() => import("./pages/Student.tsx"));
const Grades = lazy(() => import("./pages/Grades.tsx"));
const Attendance = lazy(() => import("./pages/Attendance.tsx"));
const Discipline = lazy(() => import("./pages/Discipline.tsx"));
const Schedule = lazy(() => import("./pages/Schedule.tsx"));
const Transcript = lazy(() => import("./pages/Transcript.tsx"));
const TestScores = lazy(() => import("./pages/TestScores.tsx"));
const Communications = lazy(() => import("./pages/Communications.tsx"));
const Fees = lazy(() => import("./pages/Fees.tsx"));
const Settings = lazy(() => import("./pages/Settings.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <div key={location.pathname} className="animate-fade-in">
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/" element={<RequireSetup><Index /></RequireSetup>} />
          <Route path="/student" element={<RequireSetup><Student /></RequireSetup>} />
          <Route path="/grades" element={<RequireSetup><Grades /></RequireSetup>} />
          <Route path="/attendance" element={<RequireSetup><Attendance /></RequireSetup>} />
          <Route path="/discipline" element={<RequireSetup><Discipline /></RequireSetup>} />
          <Route path="/schedule" element={<RequireSetup><Schedule /></RequireSetup>} />
          <Route path="/transcript" element={<RequireSetup><Transcript /></RequireSetup>} />
          <Route path="/test-scores" element={<RequireSetup><TestScores /></RequireSetup>} />
          <Route path="/communications" element={<RequireSetup><Communications /></RequireSetup>} />
          <Route path="/fees" element={<RequireSetup><Fees /></RequireSetup>} />
          <Route path="/settings" element={<RequireSetup><Settings /></RequireSetup>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Suspense>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
