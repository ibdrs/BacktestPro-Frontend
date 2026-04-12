import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";

const runs = [
  { name: "MA_Crossover_Run_20250408", id: "BT-2025-0408-001", strategy: "Moving Average Crossover", dataset: "SPY_Daily_5Y", date: "2025-04-08", status: "Completed", metric: "CAGR: 12.4%" },
  { name: "RSI_Strategy_20250405", id: "BT-2025-0405-002", strategy: "RSI Momentum", dataset: "AAPL_Daily_3Y", date: "2025-04-05", status: "Completed", metric: "CAGR: 8.7%" },
  { name: "MACD_Test_20250402", id: "BT-2025-0402-003", strategy: "MACD Divergence", dataset: "QQQ_Daily_5Y", date: "2025-04-02", status: "Failed", metric: "-" },
  { name: "Bollinger_Bands_20250328", id: "BT-2025-0328-004", strategy: "Bollinger Mean Reversion", dataset: "SPY_Daily_10Y", date: "2025-03-28", status: "Completed", metric: "CAGR: 15.2%" },
  { name: "EMA_Cross_20250325", id: "BT-2025-0325-005", strategy: "EMA Crossover", dataset: "TSLA_Daily_2Y", date: "2025-03-25", status: "Completed", metric: "CAGR: 6.3%" },
  { name: "Momentum_Strategy_20250320", id: "BT-2025-0320-006", strategy: "Momentum Breakout", dataset: "IWM_Daily_5Y", date: "2025-03-20", status: "Completed", metric: "CAGR: 9.8%" },
  { name: "Stochastic_Test_20250315", id: "BT-2025-0315-007", strategy: "Stochastic Oscillator", dataset: "GLD_Daily_7Y", date: "2025-03-15", status: "Completed", metric: "CAGR: 4.1%" },
  { name: "ATR_Trailing_20250310", id: "BT-2025-0310-008", strategy: "ATR Trailing Stop", dataset: "SPY_Daily_3Y", date: "2025-03-10", status: "Completed", metric: "CAGR: 11.5%" },
  { name: "Pairs_Trading_20250305", id: "BT-2025-0305-009", strategy: "Pairs Trading", dataset: "SPY_QQQ_5Y", date: "2025-03-05", status: "Completed", metric: "CAGR: 7.9%" },
  { name: "Volume_Profile_20250228", id: "BT-2025-0228-010", strategy: "Volume Profile", dataset: "NVDA_Daily_2Y", date: "2025-02-28", status: "Completed", metric: "CAGR: 18.6%" },
];

export default function BacktestHistory() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="col-span-1">
            <p className="text-xs text-muted-foreground mb-1">Search by Name or ID</p>
            <div className="relative">
              <Input
                placeholder="Search runs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Input disabled placeholder="" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Date Range</p>
            <Input disabled placeholder="" />
          </div>
        </div>

        {/* Table */}
        <Card className="mt-6">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Past Runs</CardTitle>
            <span className="text-sm text-muted-foreground">24 total runs</span>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Run Name / ID</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Key Metric</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{r.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {r.id}</p>
                    </TableCell>
                    <TableCell className="text-sm">{r.strategy}</TableCell>
                    <TableCell className="text-sm">{r.dataset}</TableCell>
                    <TableCell className="text-sm">{r.date}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "Completed" ? "default" : "destructive"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{r.metric}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/history/detail")}>
                          View Detail
                        </Button>
                        <button className="p-1 hover:bg-muted rounded">
                          <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>Showing 1-10 of 24 runs</span>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>‹</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">›</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
