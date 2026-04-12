import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Trophy, TrendingUp, Calendar, Play } from "lucide-react";

const stats = [
  { label: "Total Backtests", value: "47", icon: BarChart3, link: "/history" },
  { label: "Win Rate", value: "68.3%", icon: Trophy, link: null },
  { label: "Avg Return", value: "+12.4%", icon: TrendingUp, link: null },
  { label: "Last Run", value: "2d ago", icon: Calendar, link: "/results" },
];

const recentActivity = [
  { name: "Moving Average Crossover Strategy", return: "+15.2%", winRate: "72%", time: "2 days ago" },
  { name: "RSI Momentum Strategy", return: "+8.7%", winRate: "65%", time: "5 days ago" },
  { name: "Bollinger Bands Breakout", return: "+22.1%", winRate: "78%", time: "1 week ago" },
  { name: "MACD Divergence Strategy", return: "+5.3%", winRate: "61%", time: "1 week ago" },
  { name: "Support & Resistance Levels", return: "+18.9%", winRate: "70%", time: "2 weeks ago" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your backtesting activity and performance
        </p>

        {/* Stats */}
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
                <p className="text-2xl font-semibold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
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

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-0 divide-y">
              {recentActivity.map((a) => (
                <div key={a.name} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium cursor-pointer hover:underline hover:text-primary transition-colors" onClick={() => navigate("/results")}>{a.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Return: {a.return} · Win Rate: {a.winRate} · {a.time}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/results")}>
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="link" onClick={() => navigate("/history")}>
                View All History →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
