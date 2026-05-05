import { ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home, GraduationCap, CalendarCheck, AlertTriangle, Calendar,
  FileText, ClipboardList, MessageSquare, DollarSign, Settings as SettingsIcon, ChevronLeft,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/student", label: "Student", icon: ClipboardList },
  { to: "/grades", label: "Grades", icon: GraduationCap },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/discipline", label: "Discipline", icon: AlertTriangle },
  { to: "/schedule", label: "Schedule", icon: Calendar },
  { to: "/transcript", label: "Transcript", icon: FileText },
  { to: "/test-scores", label: "LEAP", icon: GraduationCap },
  { to: "/communications", label: "Messages", icon: MessageSquare },
  { to: "/fees", label: "Fees", icon: DollarSign },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

const BOTTOM = ["/", "/grades", "/schedule", "/communications", "/settings"];

interface Props {
  title: string;
  children: ReactNode;
  showBack?: boolean;
}

export const MobileLayout = ({ title, children, showBack }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <header className="app-header sticky top-0 z-20 flex items-center gap-2 px-4 py-4 shadow-sm">
        {showBack && location.pathname !== "/" && (
          <button
            onClick={() => navigate(-1)}
            className="-ml-2 rounded-full p-1 hover:bg-white/10"
            aria-label="Back"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </header>

      <main className="flex-1 animate-fade-in px-4 py-4 pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-md justify-around border-t border-border bg-card/95 px-2 py-2 backdrop-blur">
        {NAV_ITEMS.filter((i) => BOTTOM.includes(i.to)).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
