import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
} from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TrendingUp, Target, TrendingDown, Trophy, ArrowLeft, Info } from "lucide-react";
import { api, type BacktestResult, type EquityCurvePoint, type Trade } from "@/lib/api";

// ── Metric calculations ────────────────────────────────────────────────────

function computeWinRate(trades: Trade[]): number | null {
  const sells = trades.filter((t) => t.side === "SELL");
  if (sells.length === 0) return null;
  return (sells.filter((t) => t.pnl > 0).length / sells.length) * 100;
}

function computeAvgWin(trades: Trade[]): number | null {
  const wins = trades.filter((t) => t.side === "SELL" && t.pnl > 0);
  if (wins.length === 0) return null;
  return wins.reduce((s, t) => s + Number(t.pnl), 0) / wins.length;
}

function computeAvgLoss(trades: Trade[]): number | null {
  const losses = trades.filter((t) => t.side === "SELL" && t.pnl < 0);
  if (losses.length === 0) return null;
  return losses.reduce((s, t) => s + Number(t.pnl), 0) / losses.length;
}

function computeProfitFactor(trades: Trade[]): number | null {
  const sells = trades.filter((t) => t.side === "SELL");
  const grossWin  = sells.filter((t) => t.pnl > 0).reduce((s, t) => s + Number(t.pnl), 0);
  const grossLoss = Math.abs(sells.filter((t) => t.pnl < 0).reduce((s, t) => s + Number(t.pnl), 0));
  if (grossLoss === 0) return null;
  return grossWin / grossLoss;
}

function computeMaxDrawdown(curve: EquityCurvePoint[]): number | null {
  if (curve.length < 2) return null;
  let peak = curve[0].value;
  let maxDd = 0;
  for (const p of curve) {
    const v = Number(p.value);
    if (v > peak) peak = v;
    const dd = (peak - v) / peak;
    if (dd > maxDd) maxDd = dd;
  }
  return -maxDd * 100;
}

function computeSharpe(curve: EquityCurvePoint[]): number | null {
  if (curve.length < 3) return null;
  const returns: number[] = [];
  for (let i = 1; i < curve.length; i++) {
    const prev = Number(curve[i - 1].value);
    const curr = Number(curve[i].value);
    if (prev === 0) continue;
    returns.push((curr - prev) / prev);
  }
  if (returns.length < 2) return null;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((s, r) => s + (r - mean) ** 2, 0) / returns.length;
  const std = Math.sqrt(variance);
  if (std === 0) return null;
  return (mean / std) * Math.sqrt(252);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number | null | undefined, decimals = 2, prefix = ""): string {
  if (n == null) return "—";
  return `${prefix}${n >= 0 ? "+" : ""}${n.toFixed(decimals)}`;
}

function fmtMoney(n: number | null | undefined): string {
  if (n == null) return "—";
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusVariant(status: BacktestResult["status"]): "default" | "destructive" | "secondary" {
  if (status === "completed") return "default";
  if (status === "failed") return "destructive";
  return "secondary";
}

// ── Tooltip label helper ───────────────────────────────────────────────────

function MetricLabel({ label, tip }: { label: string; tip: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3 w-3 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-56 text-xs">
          {tip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function BacktestResults() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = Number(params.get("id"));

  const { data: backtest, isLoading, isError } = useQuery({
    queryKey: ["backtest", id],
    queryFn: () => api.backtests.get(id),
    enabled: !isNaN(id) && id > 0,
  });

  if (!id || isNaN(id)) {
    navigate("/history", { replace: true });
    return null;
  }

  if (isLoading) return <DashboardLayout><p className="text-sm text-muted-foreground mt-8">Loading…</p></DashboardLayout>;
  if (isError || !backtest) return <DashboardLayout><p className="text-sm text-destructive mt-8">Could not load backtest.</p></DashboardLayout>;

  const curve  = backtest.equity_curve ?? [];
  const trades = backtest.trades ?? [];

  const winRate      = computeWinRate(trades);
  const avgWin       = computeAvgWin(trades);
  const avgLoss      = computeAvgLoss(trades);
  const profitFactor = computeProfitFactor(trades);
  const maxDrawdown  = computeMaxDrawdown(curve);
  const sharpe       = computeSharpe(curve);

  const topMetrics = [
    {
      label: "Total Return",
      tip: "Percentage gain or loss relative to the initial capital.",
      value: fmt(backtest.total_return_pct) + "%",
      icon: TrendingUp,
    },
    {
      label: "Sharpe Ratio",
      tip: "Risk-adjusted return. A ratio above 1 is generally considered good. It compares the return of the strategy to its volatility — higher means more return per unit of risk.",
      value: sharpe != null ? sharpe.toFixed(2) : "—",
      icon: Target,
    },
    {
      label: "Max Drawdown",
      tip: "The largest peak-to-trough drop in portfolio value during the backtest. E.g. -20% means at some point the portfolio fell 20% from its highest point before recovering.",
      value: maxDrawdown != null ? fmt(maxDrawdown) + "%" : "—",
      icon: TrendingDown,
    },
    {
      label: "Win Rate",
      tip: "Percentage of closed trades (sells) that were profitable.",
      value: winRate != null ? winRate.toFixed(1) + "%" : "—",
      icon: Trophy,
    },
  ];

  const chartData = curve.map((p) => ({
    timestamp: Number(p.timestamp),
    value: Number(p.value),
  }));

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/new-backtest")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Run Another
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate("/history")}>
            View History
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold">{backtest.strategy_name}</h1>
            <p className="text-sm text-muted-foreground">Run #{backtest.id}</p>
          </div>
          <Badge variant={statusVariant(backtest.status)}>
            {backtest.status.charAt(0).toUpperCase() + backtest.status.slice(1)}
          </Badge>
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {topMetrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted mb-3">
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <MetricLabel label={m.label} tip={m.tip} />
                <p className="text-2xl font-semibold mt-1">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Equity Curve */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center gap-1">
              <CardTitle className="text-base">Equity Curve</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-64 text-xs">
                  Portfolio value over time. A steadily rising line means the strategy grows
                  consistently. Sharp drops indicate drawdown periods.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(ts) => new Date(Number(ts)).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}
                    interval="preserveStartEnd"
                    minTickGap={60}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(v) => `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    tick={{ fontSize: 11 }}
                    width={70}
                  />
                  <ChartTooltip
                    formatter={(v: number) => [`$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, "Portfolio"]}
                    labelFormatter={(ts) => new Date(Number(ts)).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} className="stroke-primary" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Not enough data points to draw a chart.</p>
            )}
          </CardContent>
        </Card>

        {/* Additional metrics */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Additional Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Profit Factor", tip: "Gross profit divided by gross loss. Above 1.0 means the strategy makes more than it loses overall.", value: profitFactor != null ? profitFactor.toFixed(2) : "—" },
                { label: "Avg Win", tip: "Average profit per winning trade.", value: fmtMoney(avgWin) },
                { label: "Avg Loss", tip: "Average loss per losing trade.", value: avgLoss != null ? fmtMoney(avgLoss) : "—" },
                { label: "Total Trades", tip: "Number of individual buy and sell orders executed.", value: String(trades.length) },
                { label: "Final Value", tip: "Portfolio value at the end of the backtest.", value: fmtMoney(backtest.final_portfolio_value) },
                { label: "Initial Capital", tip: "Starting cash used for this backtest.", value: fmtMoney(backtest.initial_capital) },
              ].map((m) => (
                <div key={m.label}>
                  <MetricLabel label={m.label} tip={m.tip} />
                  <p className="text-lg font-semibold mt-0.5">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trade history */}
        <Card className="mt-4">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Trade History</CardTitle>
            <span className="text-sm text-muted-foreground">{trades.length} trade{trades.length !== 1 ? "s" : ""}</span>
          </CardHeader>
          <CardContent>
            {trades.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No trades were executed.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Side</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="text-right">P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-sm">{new Date(Number(t.timestamp)).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={t.side === "BUY" ? "secondary" : "default"}>{t.side}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">${Number(t.price).toFixed(2)}</TableCell>
                      <TableCell className="text-sm">{Number(t.quantity).toFixed(4)}</TableCell>
                      <TableCell className="text-sm">${Number(t.value).toFixed(2)}</TableCell>
                      <TableCell className={`text-right text-sm font-medium ${Number(t.pnl) > 0 ? "text-green-600" : Number(t.pnl) < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                        {Number(t.pnl) !== 0 ? `${Number(t.pnl) >= 0 ? "+" : ""}$${Math.abs(Number(t.pnl)).toFixed(2)}` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
