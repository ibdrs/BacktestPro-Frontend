import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, RefreshCw, BarChart3 } from "lucide-react";

const keyMetrics = [
  { label: "Profit/Loss", value: "12.4%", sub: "Compound Annual Growth Rate" },
  { label: "Max Drawdown", value: "-18.7%", sub: "Largest peak-to-trough decline" },
  { label: "Sharpe Ratio", value: "1.42", sub: "Risk-adjusted return" },
  { label: "Total Trades", value: "87", sub: "Number of executed trades" },
];

const additionalMetrics = [
  { label: "Win Rate", value: "58.6%" },
  { label: "Average Win", value: "$2,340" },
  { label: "Average Loss", value: "-$1,820" },
  { label: "Profit Factor", value: "1.64" },
  { label: "Total Return", value: "82.3%" },
  { label: "Volatility (Annual)", value: "16.4%" },
];

const tradeLog = [
  { id: 1, type: "Long", entry: "2020-02-15", exit: "2020-03-22", entryP: "$325.40", exitP: "$298.10", pnl: "-$2,730", ret: "-8.4%" },
  { id: 2, type: "Long", entry: "2020-04-10", exit: "2020-06-18", entryP: "$280.50", exitP: "$312.80", pnl: "$3,230", ret: "11.5%" },
  { id: 3, type: "Long", entry: "2020-07-05", exit: "2020-09-12", entryP: "$318.20", exitP: "$335.60", pnl: "$1,740", ret: "5.5%" },
  { id: 4, type: "Long", entry: "2020-10-20", exit: "2020-11-28", entryP: "$342.10", exitP: "$361.90", pnl: "$1,980", ret: "5.8%" },
  { id: 5, type: "Long", entry: "2021-01-08", exit: "2021-03-15", entryP: "$372.40", exitP: "$389.20", pnl: "$1,680", ret: "4.5%" },
  { id: 6, type: "Long", entry: "2021-04-22", exit: "2021-06-10", entryP: "$415.80", exitP: "$422.50", pnl: "$670", ret: "1.6%" },
  { id: 7, type: "Long", entry: "2021-07-18", exit: "2021-09-05", entryP: "$438.60", exitP: "$450.20", pnl: "$1,160", ret: "2.6%" },
  { id: 8, type: "Long", entry: "2021-10-12", exit: "2021-12-20", entryP: "$445.30", exitP: "$472.90", pnl: "$2,760", ret: "6.2%" },
  { id: 9, type: "Long", entry: "2022-02-05", exit: "2022-03-18", entryP: "$452.80", exitP: "$428.10", pnl: "-$2,470", ret: "-5.5%" },
  { id: 10, type: "Long", entry: "2022-05-10", exit: "2022-07-22", entryP: "$410.20", exitP: "$395.80", pnl: "-$1,440", ret: "-3.5%" },
];

export default function HistoryDetail() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to History
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Rerun using same setup
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold">MA_Crossover_Run_20250408</h1>
            <p className="text-sm text-muted-foreground">Run ID: BT-2025-0408-001</p>
          </div>
          <Badge className="bg-success text-success-foreground">Completed</Badge>
        </div>

        {/* Run info */}
        <Card className="mt-4">
          <CardContent className="p-5">
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Strategy</p>
                <p className="font-medium">Moving Average Crossover</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dataset</p>
                <p className="font-medium">SPY_Daily_5Y</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date Range</p>
                <p className="font-medium">2020-01-01 to 2025-01-01</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Run Date</p>
                <p className="font-medium">2025-04-08 14:32:15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key metrics */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {keyMetrics.map((m) => (
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
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Additional Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {additionalMetrics.map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-muted-foreground">{m.label}</p>
                  <p className="text-lg font-semibold">{m.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equity Curve */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Equity Curve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-48 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Equity Curve Chart Placeholder</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trade Log */}
        <Card className="mt-4">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Trade Log</CardTitle>
            <span className="text-sm text-muted-foreground">Showing 10 of 87 trades</span>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trade #</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Exit Date</TableHead>
                  <TableHead>Entry Price</TableHead>
                  <TableHead>Exit Price</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead className="text-right">Return %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeLog.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.type}</TableCell>
                    <TableCell>{t.entry}</TableCell>
                    <TableCell>{t.exit}</TableCell>
                    <TableCell>{t.entryP}</TableCell>
                    <TableCell>{t.exitP}</TableCell>
                    <TableCell className={t.pnl.startsWith("-") ? "text-destructive" : "text-success"}>
                      {t.pnl}
                    </TableCell>
                    <TableCell className={`text-right ${t.ret.startsWith("-") ? "text-destructive" : "text-success"}`}>
                      {t.ret}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="text-center mt-4">
              <Button variant="ghost" size="sm">↓ View all 87 trades</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
