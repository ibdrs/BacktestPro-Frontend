import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Play, Eye, LayoutGrid, List } from "lucide-react";

const strategies = [
  { name: "MA Crossover Strategy", desc: "Classic moving average crossover using 50-day and 200-day simple moving averages for trend identification and entry signals.", tags: ["Trend Following", "Daily", "Moving Averages"] },
  { name: "RSI Mean Reversion", desc: "Buys oversold conditions and sells overbought conditions using RSI indicator with 30/70 thresholds for entries and exits.", tags: ["Mean Reversion", "Daily", "RSI"] },
  { name: "MACD Momentum", desc: "Momentum strategy using MACD crossovers and histogram analysis to identify trend changes and strong momentum moves.", tags: ["Momentum", "Daily", "MACD"] },
  { name: "Bollinger Band Squeeze", desc: "Identifies low volatility periods using Bollinger Bands and enters on breakout direction when volatility expands.", tags: ["Breakout", "Daily", "Bollinger Bands"] },
  { name: "Intraday Scalping", desc: "Short-term intraday strategy using 5-min and 15-min moving averages with tight stops for quick profits on momentum moves.", tags: ["Momentum", "Intraday", "Moving Averages"] },
  { name: "Stochastic Oscillator", desc: "Mean reversion strategy using stochastic oscillator to identify overbought and oversold conditions in ranging markets.", tags: ["Mean Reversion", "Daily", "Stochastic"] },
  { name: "Triple EMA Crossover", desc: "Advanced trend-following strategy using three exponential moving averages (12, 26, 50) for multi-timeframe confirmation.", tags: ["Trend Following", "Daily", "Moving Averages"] },
  { name: "Weekly Swing Trading", desc: "Longer-term swing strategy on weekly charts using support/resistance levels and momentum confirmation for entries.", tags: ["Momentum", "Weekly", "RSI"] },
  { name: "Gap Trading Strategy", desc: "Trades price gaps at market open, entering positions based on gap size and direction with predefined profit targets.", tags: ["Breakout", "Daily", "Moving Averages"] },
];

const filterGroups = [
  { label: "Strategy Type", options: ["Trend Following", "Mean Reversion", "Momentum", "Breakout", "Options"] },
  { label: "Timeframe", options: ["Intraday", "Daily", "Weekly", "Monthly"] },
  { label: "Indicators", options: ["Moving Averages", "RSI", "MACD", "Bollinger Bands", "Stochastic"] },
];

export default function StrategyTemplates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-semibold">Strategy Templates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and select pre-configured trading strategies
        </p>

        <div className="flex gap-6 mt-6">
          {/* Sidebar filters */}
          <div className="w-52 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold">Filters</span>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => setView("grid")}
                  className={`p-1.5 rounded ${view === "grid" ? "bg-muted" : ""}`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded ${view === "list" ? "bg-muted" : ""}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            {filterGroups.map((group) => (
              <div key={group.label} className="mb-5">
                <p className="text-sm font-semibold mb-2">{group.label}</p>
                <div className="space-y-2">
                  {group.options.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full">Reset Filters</Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="relative mb-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-4 w-4 absolute right-3 top-2.5 text-muted-foreground" />
            </div>

            <div className={view === "grid" ? "grid grid-cols-2 gap-4" : "space-y-3"}>
              {strategies.map((s) => (
                <Card key={s.name}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm">{s.name}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {s.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" onClick={() => navigate("/new-backtest")}>
                        <Play className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-1 mt-6">
              <Button variant="outline" size="sm" disabled>‹</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">›</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
