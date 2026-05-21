import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, X, Play } from "lucide-react";
import { api } from "@/lib/api";

export default function NewBacktest() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [datasetId, setDatasetId] = useState<string>("");
  const [strategy, setStrategy] = useState<string>("");
  const [initialCapital, setInitialCapital] = useState("10000");
  const [positionSize, setPositionSize] = useState("0.1");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: datasets = [], isLoading: datasetsLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: api.datasets.list,
  });

  const importMutation = useMutation({
    mutationFn: (f: File) => api.datasets.import(f),
    onSuccess: (result) => {
      setDatasetId(String(result.dataset.id));
      setFile(null);
    },
    onError: (err: Error) => setFormError(err.message),
  });

  const backtestMutation = useMutation({
    mutationFn: () =>
      api.backtests.create({
        datasetId: Number(datasetId),
        strategy,
        initialCapital: Number(initialCapital),
        positionSize: Number(positionSize),
      }),
    onSuccess: (result) => {
      navigate(`/history/detail?id=${result.id}`);
    },
    onError: (err: Error) => setFormError(err.message),
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleUpload() {
    if (!file) return;
    setFormError(null);
    importMutation.mutate(file);
  }

  function handleRun() {
    setFormError(null);
    if (!datasetId) { setFormError("Select or upload a dataset first."); return; }
    if (!strategy) { setFormError("Select a strategy."); return; }
    const cap = Number(initialCapital);
    const ps = Number(positionSize);
    if (isNaN(cap) || cap <= 0) { setFormError("Initial capital must be a positive number."); return; }
    if (isNaN(ps) || ps <= 0 || ps > 1) { setFormError("Position size must be between 0 and 1 (e.g. 0.1 = 10%)."); return; }
    backtestMutation.mutate();
  }

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
              <p className="text-xs text-muted-foreground mt-1">Supported format: CSV (max 50MB)</p>
              <label className="mt-3 inline-block">
                <Button variant="default" size="sm" asChild>
                  <span>
                    <Upload className="h-3 w-3 mr-1" />
                    Select File
                  </span>
                </Button>
                <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {file && (
              <div className="flex items-center justify-between mt-4 p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleUpload}
                    disabled={importMutation.isPending}
                  >
                    {importMutation.isPending ? "Uploading…" : "Upload"}
                  </Button>
                  <button onClick={() => setFile(null)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}

            {/* Or pick existing dataset */}
            {datasets.length > 0 && (
              <div className="mt-4">
                <Label>Or use an existing dataset</Label>
                <Select value={datasetId} onValueChange={setDatasetId}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={datasetsLoading ? "Loading…" : "Select dataset…"} />
                  </SelectTrigger>
                  <SelectContent>
                    {datasets.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name} ({d.row_count.toLocaleString()} rows)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {importMutation.isSuccess && (
              <p className="text-sm text-green-600 mt-2">
                Dataset imported successfully ({importMutation.data.validRows} valid rows).
              </p>
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
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a strategy…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="momentum">Momentum</SelectItem>
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
                <Label>Initial Capital ($)</Label>
                <Input
                  type="number"
                  min="1"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Position Size (0–1)</Label>
                <Input
                  type="number"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">e.g. 0.1 = 10% per trade</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {formError && (
          <p className="text-sm text-destructive mt-4">{formError}</p>
        )}

        <div className="flex gap-3 mt-6">
          <Button onClick={handleRun} disabled={backtestMutation.isPending}>
            <Play className="h-4 w-4 mr-2" />
            {backtestMutation.isPending ? "Running…" : "Run Backtest"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
