import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "./pages/Index.tsx";
import Student from "./pages/Student.tsx";
import Grades from "./pages/Grades.tsx";
import Attendance from "./pages/Attendance.tsx";
import Discipline from "./pages/Discipline.tsx";
import Schedule from "./pages/Schedule.tsx";
import Transcript from "./pages/Transcript.tsx";
import TestScores from "./pages/TestScores.tsx";
import Communications from "./pages/Communications.tsx";
import Fees from "./pages/Fees.tsx";
import Settings from "./pages/Settings.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/student" element={<Student />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/discipline" element={<Discipline />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/transcript" element={<Transcript />} />
            <Route path="/test-scores" element={<TestScores />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
