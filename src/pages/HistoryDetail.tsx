import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { api, type BacktestResult, type Trade } from "@/lib/api";

function statusVariant(status: BacktestResult["status"]): "default" | "destructive" | "secondary" {
  if (status === "completed") return "default";
  if (status === "failed") return "destructive";
  return "secondary";
}

function formatDate(ms: number | string | null) {
  if (ms == null) return "—";
  return new Date(Number(ms)).toLocaleDateString();
}

function computeWinRate(trades: Trade[]) {
  const sells = trades.filter((t) => t.side === "SELL");
  if (sells.length === 0) return null;
  const wins = sells.filter((t) => t.pnl > 0);
  return (wins.length / sells.length) * 100;
}

export default function HistoryDetail() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = Number(params.get("id"));

  const { data: backtest, isLoading, isError } = useQuery({
    queryKey: ["backtest", id],
    queryFn: () => api.backtests.get(id),
    enabled: !isNaN(id) && id > 0,
  });

  if (!id || isNaN(id)) {
    return (
      <DashboardLayout>
        <p className="text-sm text-destructive mt-8">No backtest ID provided.</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to History
          </Button>
          {backtest && (
            <Button size="sm" onClick={() => navigate(`/results?id=${id}`)}>
              View Full Results
            </Button>
          )}
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mt-8">Loading…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive mt-8">
            Could not load backtest. Make sure the server is running.
          </p>
        )}

        {backtest && (
          <>
            <div className="flex items-center justify-between mt-4">
              <div>
                <h1 className="text-2xl font-semibold">{backtest.strategy_name}</h1>
                <p className="text-sm text-muted-foreground">Run ID: #{backtest.id}</p>
              </div>
              <Badge variant={statusVariant(backtest.status)}>
                {backtest.status.charAt(0).toUpperCase() + backtest.status.slice(1)}
              </Badge>
            </div>

            {/* Run info */}
            <Card className="mt-4">
              <CardContent className="p-5">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Strategy</p>
                    <p className="font-medium">{backtest.strategy_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Dataset ID</p>
                    <p className="font-medium">#{backtest.dataset_id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date Range</p>
                    <p className="font-medium">
                      {formatDate(backtest.start_date)} — {formatDate(backtest.end_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Run Date</p>
                    <p className="font-medium">{new Date(backtest.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key metrics */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[
                {
                  label: "Total Return",
                  value: backtest.total_return_pct != null
                    ? `${backtest.total_return_pct >= 0 ? "+" : ""}${backtest.total_return_pct.toFixed(2)}%`
                    : "—",
                  sub: "vs initial capital",
                },
                {
                  label: "Final Value",
                  value: backtest.final_portfolio_value != null
                    ? `$${backtest.final_portfolio_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : "—",
                  sub: "portfolio value",
                },
                {
                  label: "Initial Capital",
                  value: `$${backtest.initial_capital.toLocaleString()}`,
                  sub: "starting amount",
                },
                {
                  label: "Total Trades",
                  value: String(backtest.trades.length),
                  sub: "executed trades",
                },
              ].map((m) => (
                <Card key={m.label}>
                  <CardContent className="p-5">
                    <p className="text-xs text-muted-foreground">{m.label}</p>
                    <p className="text-2xl font-semibold mt-1">{m.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional metrics */}
            {backtest.trades.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-base">Additional Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {
                        label: "Win Rate",
                        value: (() => {
                          const wr = computeWinRate(backtest.trades);
                          return wr != null ? `${wr.toFixed(1)}%` : "—";
                        })(),
                      },
                      {
                        label: "Position Size",
                        value: `${(backtest.position_size * 100).toFixed(0)}% per trade`,
                      },
                      {
                        label: "Final Cash",
                        value: backtest.final_cash != null
                          ? `$${backtest.final_cash.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                          : "—",
                      },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                        <p className="text-lg font-semibold">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Equity Curve placeholder */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade Log */}
            <Card className="mt-4">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">Trade Log</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {backtest.trades.length} trade{backtest.trades.length !== 1 ? "s" : ""}
                </span>
              </CardHeader>
              <CardContent>
                {backtest.trades.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No trades executed.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="text-right">P&L</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {backtest.trades.map((t, i) => (
                        <TableRow key={t.id}>
                          <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                          <TableCell>
                            <Badge variant={t.side === "BUY" ? "secondary" : "default"}>
                              {t.side}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(Number(t.timestamp)).toLocaleDateString()}</TableCell>
                          <TableCell className="text-sm">${t.price.toFixed(2)}</TableCell>
                          <TableCell className="text-sm">{t.quantity.toFixed(4)}</TableCell>
                          <TableCell className="text-sm">${t.value.toFixed(2)}</TableCell>
                          <TableCell className={`text-right text-sm ${t.pnl > 0 ? "text-green-600" : t.pnl < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                            {t.pnl !== 0 ? `${t.pnl >= 0 ? "+" : ""}$${t.pnl.toFixed(2)}` : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
