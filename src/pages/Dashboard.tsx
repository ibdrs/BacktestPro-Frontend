import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Trophy, TrendingUp, Calendar, Play } from "lucide-react";
import { api, type BacktestRun } from "@/lib/api";

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}

function computeStats(backtests: BacktestRun[]) {
  const completed = backtests.filter((b) => b.status === "completed" && b.total_return_pct != null);
  const positive = completed.filter((b) => (b.total_return_pct ?? 0) > 0);
  const winRate = completed.length > 0 ? (positive.length / completed.length) * 100 : null;
  const avgReturn =
    completed.length > 0
      ? completed.reduce((sum, b) => sum + (b.total_return_pct ?? 0), 0) / completed.length
      : null;
  const lastRun = backtests[0]?.created_at ?? null;
  return { winRate, avgReturn, lastRun, total: backtests.length };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: backtests = [], isLoading, isError } = useQuery({
    queryKey: ["backtests"],
    queryFn: api.backtests.list,
  });

  const { winRate, avgReturn, lastRun, total } = computeStats(backtests);

  const stats = [
    { label: "Total Backtests", value: total.toString(), icon: BarChart3, link: "/history" },
    {
      label: "Win Rate",
      value: winRate != null ? `${winRate.toFixed(1)}%` : "—",
      icon: Trophy,
      link: null,
    },
    {
      label: "Avg Return",
      value: avgReturn != null ? `${avgReturn >= 0 ? "+" : ""}${avgReturn.toFixed(1)}%` : "—",
      icon: TrendingUp,
      link: null,
    },
    {
      label: "Last Run",
      value: lastRun ? formatTimeAgo(lastRun) : "—",
      icon: Calendar,
      link: backtests[0] ? `/history/detail?id=${backtests[0].id}` : null,
    },
  ];

  const recent = backtests.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your backtesting activity and performance
        </p>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {stats.map((s) => (
            <Card
              key={s.label}
              className={s.link ? "cursor-pointer hover:border-primary/50 transition-colors" : ""}
              onClick={() => s.link && navigate(s.link)}
            >
              <CardContent className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted mb-3">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-semibold">{isLoading ? "…" : s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardContent className="p-8 text-center">
            <h2 className="text-lg font-semibold">Ready to Test Your Strategy?</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Configure parameters, select your data range, and run comprehensive backtests on your trading strategies.
            </p>
            <Button className="mt-4" onClick={() => navigate("/new-backtest")}>
              <Play className="h-4 w-4 mr-2" />
              Run New Backtest
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>

            {isLoading && (
              <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
            )}
            {isError && (
              <p className="text-sm text-destructive py-4 text-center">
                Could not reach the backend. Make sure the server is running.
              </p>
            )}
            {!isLoading && !isError && recent.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No backtests yet. Run your first one above.
              </p>
            )}

            <div className="space-y-0 divide-y">
              {recent.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium cursor-pointer hover:underline hover:text-primary transition-colors"
                        onClick={() => navigate(`/history/detail?id=${b.id}`)}
                      >
                        {b.strategy_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.total_return_pct != null
                          ? `Return: ${b.total_return_pct >= 0 ? "+" : ""}${b.total_return_pct.toFixed(2)}%`
                          : `Status: ${b.status}`}{" "}
                        · {formatTimeAgo(b.created_at)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/history/detail?id=${b.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            {recent.length > 0 && (
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => navigate("/history")}>
                  View All History →
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
