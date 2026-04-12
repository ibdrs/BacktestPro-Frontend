import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X, Play } from "lucide-react";

export default function NewBacktest() {
  const navigate = useNavigate();
  const [file, setFile] = useState<string | null>("market_data_2025.csv");

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold">New Backtest Setup</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your backtest parameters and upload data
        </p>

        {/* Data Upload */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Data Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drop CSV file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported format: CSV (max 50MB)
              </p>
              <Button variant="default" size="sm" className="mt-3">
                <Upload className="h-3 w-3 mr-1" />
                Select File
              </Button>
            </div>

            {file && (
              <div className="flex items-center justify-between mt-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file}</p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategy Configuration */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Strategy Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Select Strategy</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a strategy..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ma-crossover">Moving Average Crossover</SelectItem>
                <SelectItem value="rsi-momentum">RSI Momentum</SelectItem>
                <SelectItem value="macd-divergence">MACD Divergence</SelectItem>
                <SelectItem value="bollinger">Bollinger Mean Reversion</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Backtest Parameters */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-base">Backtest Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input type="text" placeholder="YYYY-MM-DD" className="mt-1" />
              </div>
              <div>
                <Label>End Date</Label>
                <Input type="text" placeholder="YYYY-MM-DD" className="mt-1" />
              </div>
              <div>
                <Label>Initial Capital ($)</Label>
                <Input type="text" defaultValue="10000" className="mt-1" />
              </div>
              <div>
                <Label>Position Size (%)</Label>
                <Input type="text" defaultValue="10" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button onClick={() => navigate("/backtest-running")}>
            <Play className="h-4 w-4 mr-2" />
            Run Backtest
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
