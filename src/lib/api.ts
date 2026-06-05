const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export interface Dataset {
  id: number;
  name: string;
  original_filename: string;
  row_count: number;
  created_at: string;
}

export interface BacktestRun {
  id: number;
  dataset_id: number;
  strategy_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  initial_capital: number;
  position_size: number;
  start_date: number | null;
  end_date: number | null;
  final_cash: number | null;
  final_portfolio_value: number | null;
  total_return_pct: number | null;
  created_at: string;
  completed_at: string | null;
}

export interface Trade {
  id: number;
  backtest_run_id: number;
  timestamp: number;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  value: number;
  pnl: number;
}

export interface EquityCurvePoint {
  timestamp: number;
  value: number;
}

export interface BacktestResult extends BacktestRun {
  trades: Trade[];
  equity_curve: EquityCurvePoint[] | null;
}

export interface ImportResult {
  dataset: Dataset;
  validRows: number;
  totalRows: number;
  skippedRows: number;
  errors: string[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  datasets: {
    list: () => request<Dataset[]>('/api/datasets'),
    import: (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return request<ImportResult>('/api/datasets/import', { method: 'POST', body: form });
    },
  },

  backtests: {
    list: () => request<BacktestRun[]>('/api/backtests'),
    get: (id: number) => request<BacktestResult>(`/api/backtests/${id}`),
    create: (body: {
      datasetId: number;
      strategy: string;
      initialCapital: number;
      positionSize: number;
    }) =>
      request<BacktestResult>('/api/backtests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  },
};
