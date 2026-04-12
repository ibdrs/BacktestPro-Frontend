import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-backtest" element={<NewBacktest />} />
          <Route path="/backtest-running" element={<BacktestRunning />} />
          <Route path="/results" element={<BacktestResults />} />
          <Route path="/history" element={<BacktestHistory />} />
          <Route path="/history/detail" element={<HistoryDetail />} />
          <Route path="/templates" element={<StrategyTemplates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
