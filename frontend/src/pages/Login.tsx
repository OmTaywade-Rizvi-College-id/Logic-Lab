import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { login, signup } from "../lib/localAuth";

type AuthMode = "login" | "signup";

export default function Login() {
    const navigate = useNavigate();

    const [mode, setMode] = useState<AuthMode>("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "signup") {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                await signup(username, email, password);
            } else {
                await login(email, password);
            }

            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Authentication failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin(credential?: string) {
        if (!credential) {
            setError("Google did not return a credential.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const apiUrl =
                import.meta.env.VITE_API_URL ||
                "http://localhost:8080/logic-lab";

            const response = await fetch(`${apiUrl}/api/auth/google`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
            });

            if (!response.ok) {
                throw new Error(
                    response.status === 401
                        ? "Google verification failed. Please try again."
                        : `Login failed (${response.status}). Check your backend.`
                );
            }

            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to the backend."
            );
        } finally {
            setLoading(false);
        }
    }

    function switchMode(nextMode: AuthMode) {
        setMode(nextMode);
        setError("");
        setPassword("");
        setConfirmPassword("");
    }


    
return (
  <main className="min-h-screen bg-[#080d16] text-white lg:grid lg:grid-cols-2">
    {/* Left panel */}
    <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[#0b1420] p-12 lg:flex xl:p-16">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-cyan-400/[0.07] blur-3xl" />

      <div className="relative flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
          <span className="text-xl font-semibold">L</span>
        </div>
        <div>
          <p className="text-sm font-bold tracking-wide">THE LOGIC LAB</p>
          <p className="mt-1 text-[10px] tracking-[2px] text-slate-500">
            THINK · CODE · DISCOVER
          </p>
        </div>
      </div>

      <div className="relative max-w-xl py-12">
        <p className="mb-6 text-xs font-semibold tracking-[3px] text-cyan-300">
          YOUR NEXT IDEA STARTS HERE
        </p>

        <h1 className="text-5xl font-medium leading-[1.2] tracking-tight xl:text-6xl">
          Think deeper.
          <br />
          Build smarter.
          <br />
          <span className="text-orange-400">Solve anything.</span>
        </h1>

        <p className="mt-7 max-w-md text-base leading-7 text-slate-400">
          A focused workspace to explore algorithms, visualize logic,
          and improve your problem-solving skills.
        </p>

        <div className="mt-12 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <span className="text-xs text-slate-500">
            Your learning journey, in one place.
          </span>
        </div>
      </div>

      <p className="relative text-xs text-slate-600">
        THE LOGIC LAB · 2026
      </p>
    </section>

    {/* Right panel */}
    <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
      <div className="w-full max-w-[420px]">
        <div className="mb-9 lg:hidden">
          <p className="text-xs font-bold tracking-[2px] text-cyan-300">
            THE LOGIC LAB
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            {mode === "login"
              ? "Enter your details to sign in to your account."
              : "Fill in your details to get started."}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-7 grid grid-cols-2 rounded-xl border border-white/10 bg-[#0c121d] p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              mode === "login"
                ? "bg-[#202c3c] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-200 ${
              mode === "signup"
                ? "bg-[#202c3c] text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">
                Username
              </span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                minLength={2}
                maxLength={50}
                required
                className="h-12 w-full rounded-lg border border-white/10 bg-[#0c121d] px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-600 focus:border-cyan-400/70"
              />
            </label>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              maxLength={255}
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-[#0c121d] px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-600 focus:border-cyan-400/70"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={mode === "signup" ? "At least 8 characters" : "Enter your password"}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              minLength={8}
              maxLength={72}
              required
              className="h-12 w-full rounded-lg border border-white/10 bg-[#0c121d] px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-600 focus:border-cyan-400/70"
            />
          </label>

          {mode === "signup" && (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">
                Confirm password
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter your password again"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                className="h-12 w-full rounded-lg border border-white/10 bg-[#0c121d] px-4 text-sm text-white outline-none transition-colors duration-200 placeholder:text-slate-600 focus:border-cyan-400/70"
              />
            </label>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-3 text-sm leading-5 text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-cyan-300 px-4 text-sm font-semibold text-[#07111b] transition-colors duration-200 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <div className="my-7 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] tracking-[1.5px] text-slate-500">
            OR CONTINUE WITH
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="flex min-h-11 justify-center">
          <GoogleLogin
            onSuccess={(result) => handleGoogleLogin(result.credential)}
            onError={() => setError("Google sign-in was unsuccessful.")}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
            width="320"
          />
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-slate-500">
          Email and password accounts are stored locally in this browser.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-5 w-full text-center text-xs text-slate-500 transition-colors hover:text-cyan-300"
        >
          ← Back to The Logic Lab
        </button>
      </div>
    </section>
  </main>
);  
}