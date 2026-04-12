import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Target, TrendingDown, Trophy, Save, Download, RefreshCw, BarChart3 } from "lucide-react";

const metrics = [
  { label: "Profit/Loss", value: "12.4%", icon: TrendingUp },
  { label: "Sharpe Ratio", value: "1.82", icon: Target },
  { label: "Max Drawdown", value: "-18.3%", icon: TrendingDown },
  { label: "Win Rate", value: "58.2%", icon: Trophy },
];

const trades = [
  { date: "2025-03-28", action: "SELL", price: "$152.34", size: 12, pnl: "+$124.80" },
  { date: "2025-03-15", action: "BUY", price: "$142.34", size: 12, pnl: "-" },
  { date: "2025-02-20", action: "SELL", price: "$138.92", size: 15, pnl: "-$67.50" },
  { date: "2025-02-08", action: "BUY", price: "$143.42", size: 15, pnl: "-" },
  { date: "2025-01-22", action: "SELL", price: "$149.88", size: 10, pnl: "+$89.20" },
  { date: "2025-01-10", action: "BUY", price: "$140.96", size: 10, pnl: "-" },
  { date: "2024-12-18", action: "SELL", price: "$136.45", size: 8, pnl: "+$52.40" },
  { date: "2024-12-05", action: "BUY", price: "$129.90", size: 8, pnl: "-" },
];

export default function BacktestResults() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-2xl font-semibold">Backtest Results</h1>
        <p className="text-sm text-muted-foreground mt-1">
          MA_Crossover_Run_20250408 - Completed
        </p>

        {/* Performance Metrics */}
        <h3 className="font-semibold mt-6 mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted mb-3">
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-semibold mt-1">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Equity Curve */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Equity Curve Chart Placeholder</p>
                <p className="text-xs text-muted-foreground">Line chart showing portfolio value over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade History */}
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Trade History</CardTitle>
            <span className="text-sm text-muted-foreground">147 trades</span>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>
                      <span className={t.action === "BUY" ? "text-success" : "text-destructive"}>
                        {t.action}
                      </span>
                    </TableCell>
                    <TableCell>{t.price}</TableCell>
                    <TableCell>{t.size}</TableCell>
                    <TableCell className="text-right">{t.pnl}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-center mt-4">
              <Button variant="link" size="sm">View all 147 trades</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save to History
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => navigate("/new-backtest")}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Again
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
