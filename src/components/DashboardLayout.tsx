import { NavLink, useLocation } from "react-router-dom";
import { Home, Play, BarChart3, History, Globe, TrendingUp } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard / Home", icon: Home },
  { to: "/new-backtest", label: "New Backtest / Setup", icon: Play },
  { to: "/results", label: "Backtest Results", icon: BarChart3 },
  { to: "/history", label: "Backtest History", icon: History },
  { to: "/templates", label: "Strategy Templates", icon: Globe },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">BacktestPro</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>demo@user.com</span>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xs font-medium">DU</span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 border-r min-h-[calc(100vh-57px)] bg-sidebar p-3">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || 
                (item.to === "/dashboard" && location.pathname === "/");
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
