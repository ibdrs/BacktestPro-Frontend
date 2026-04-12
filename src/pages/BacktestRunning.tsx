import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Square, Loader2, TrendingUp, X } from "lucide-react";

const steps = [
  { label: "Loading Data", detail: "Completed - 1,247 rows loaded", status: "done" },
  { label: "Simulating Trades", detail: "In progress - Processing day 773 of 1,247", status: "active" },
  { label: "Computing Metrics", detail: "Pending", status: "pending" },
  { label: "Generating Report", detail: "Pending", status: "pending" },
];

export default function BacktestRunning() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(62);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => navigate("/results"), 500);
          return 100;
        }
        return p + 0.5;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">Backtest Running</h1>
        <p className="text-sm text-muted-foreground mt-1">Your backtest is currently in progress</p>

        {/* Configuration summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Backtest Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Job Name</p>
                <p className="font-medium">MA_Crossover_Run_20250408</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Strategy</p>
                <p className="font-medium">Moving Average Crossover</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Dataset</p>
                <p className="font-medium">market_data_2025.csv</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Date Range</p>
                <p className="font-medium">2024-01-01 to 2025-03-31</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Initial Capital</p>
                <p className="font-medium">$10,000</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Position Size</p>
                <p className="font-medium">10%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2 text-sm">
              <span>Current Step: Simulating Trades</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="mt-4 space-y-3">
              {steps.map((step) => (
                <div key={step.label} className="flex items-start gap-2 text-sm">
                  {step.status === "done" ? (
                    <CheckSquare className="h-4 w-4 text-foreground mt-0.5" />
                  ) : step.status === "active" ? (
                    <Loader2 className="h-4 w-4 animate-spin mt-0.5" />
                  ) : (
                    <Square className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              ⏱ Estimated time remaining: 2 minutes 34 seconds
            </p>
          </CardContent>
        </Card>

        {/* Placeholder results */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Results will appear here once backtest completes</p>
            <p className="text-xs text-muted-foreground mt-1">Performance metrics, charts, and trade details</p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 mt-6">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            <X className="h-4 w-4 mr-2" />
            Cancel Run
          </Button>
          <Button variant="link" onClick={() => navigate("/history")}>
            Run in background and view Backtest History
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
