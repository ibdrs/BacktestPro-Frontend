import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border p-10 shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-3">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-semibold">BacktestPro</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Professional backtesting platform for trading strategies
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Sign In</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-right mt-1">
                  <button type="button" className="text-xs text-muted-foreground underline">
                    Forgot password?
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                Continue as Demo User
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <button className="underline font-medium text-foreground">Sign up</button>
          </p>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">
          © 2025 BacktestPro. All rights reserved.
        </p>
        <p className="text-center text-xs text-muted-foreground mt-1">
          Terms of Service · Privacy Policy
        </p>
      </div>
    </div>
  );
}
