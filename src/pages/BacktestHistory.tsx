import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { api, type BacktestRun } from "@/lib/api";

function statusVariant(status: BacktestRun["status"]): "default" | "destructive" | "secondary" {
  if (status === "completed") return "default";
  if (status === "failed") return "destructive";
  return "secondary";
}

export default function BacktestHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: backtests = [], isLoading, isError } = useQuery({
    queryKey: ["backtests"],
    queryFn: api.backtests.list,
  });

  const filtered = backtests.filter((b) =>
    b.strategy_name.toLowerCase().includes(search.toLowerCase()) ||
    String(b.id).includes(search)
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Backtest History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all your past backtest runs
            </p>
          </div>
        </div>

        <div className="mt-6 max-w-sm">
          <p className="text-xs text-muted-foreground mb-1">Search by Strategy or ID</p>
          <div className="relative">
            <Input
              placeholder="Search runs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
          </div>
        </div>

        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Past Runs</CardTitle>
            <span className="text-sm text-muted-foreground">
              {isLoading ? "…" : `${filtered.length} run${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </CardHeader>
          <CardContent>
            {isError && (
              <p className="text-sm text-destructive py-4 text-center">
                Could not reach the backend. Make sure the server is running.
              </p>
            )}
            {!isLoading && !isError && filtered.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {backtests.length === 0 ? "No backtests yet." : "No results match your search."}
              </p>
            )}

            {filtered.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Strategy</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Return</TableHead>
                    <TableHead>Capital</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow
                      key={b.id}
                      className="cursor-pointer hover:bg-muted/60 transition-colors"
                      onClick={() => navigate(`/history/detail?id=${b.id}`)}
                    >
                      <TableCell className="text-xs text-muted-foreground">#{b.id}</TableCell>
                      <TableCell className="text-sm font-medium">{b.strategy_name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(b.status)}>
                          {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {b.total_return_pct != null
                          ? `${b.total_return_pct >= 0 ? "+" : ""}${b.total_return_pct.toFixed(2)}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${b.initial_capital.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(b.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/history/detail?id=${b.id}`)}
                        >
                          View Detail
                        </Button>
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
