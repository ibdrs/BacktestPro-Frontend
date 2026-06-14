import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getToken } from "@/lib/api";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewBacktest from "./pages/NewBacktest";
import BacktestRunning from "./pages/BacktestRunning";
import BacktestResults from "./pages/BacktestResults";
import BacktestHistory from "./pages/BacktestHistory";
import HistoryDetail from "./pages/HistoryDetail";
import StrategyTemplates from "./pages/StrategyTemplates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/new-backtest"     element={<ProtectedRoute><NewBacktest /></ProtectedRoute>} />
          <Route path="/backtest-running" element={<ProtectedRoute><BacktestRunning /></ProtectedRoute>} />
          <Route path="/results"          element={<ProtectedRoute><BacktestResults /></ProtectedRoute>} />
          <Route path="/history"          element={<ProtectedRoute><BacktestHistory /></ProtectedRoute>} />
          <Route path="/history/detail"   element={<ProtectedRoute><HistoryDetail /></ProtectedRoute>} />
          <Route path="/templates"        element={<ProtectedRoute><StrategyTemplates /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
