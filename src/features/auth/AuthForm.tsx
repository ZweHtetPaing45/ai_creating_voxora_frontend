"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { api, ApiError, saveSession } from "../../services/api";
import { Alert, Spinner } from "../../components/Status";
import { Brand } from "../../components/Brand";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter(); const search = useSearchParams(); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(""); const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim(); const password = String(form.get("password") || ""); const name = String(form.get("name") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "register" && !name) return setError("Enter your name.");
    setLoading(true);
    try {
      if (mode === "register") { await api.register({ name, email, password }); router.push(`/login?registered=1&email=${encodeURIComponent(email)}`); }
      else { const response = await api.login({ email, password }); saveSession(response); router.replace(search.get("returnTo") || "/app"); }
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : "Something went wrong."); } finally { setLoading(false); }
  };
  const login = mode === "login";
  return <main className="auth-page"><section className="auth-promo"><Brand /><div className="auth-promo-copy"><p className="eyebrow light">DOCUMENT INTELLIGENCE</p><h1>Turn every page into something you can use.</h1><p>Extract text, refine it side by side, and listen to your documents—all in one focused workspace.</p></div><div className="quote-card"><span>“</span><p>Your document, from pixels to meaning to voice.</p></div></section>
    <section className="auth-panel"><div className="auth-box"><p className="eyebrow">{login ? "WELCOME BACK" : "START YOUR WORKSPACE"}</p><h2>{login ? "Sign in to Voxora" : "Create your account"}</h2><p className="muted">{login ? "Continue working with your documents." : "Make PDFs searchable, editable, and audible."}</p>
      {login && search.get("registered") && <Alert tone="success">Account created. Sign in to continue.</Alert>}{error && <Alert>{error}</Alert>}
      <form onSubmit={submit} className="form-stack" noValidate>
        {!login && <label>Full name<input name="name" autoComplete="name" placeholder="Your name" disabled={loading} /></label>}
        <label>Email address<input name="email" type="email" autoComplete="email" defaultValue={search.get("email") || ""} placeholder="you@example.com" disabled={loading} /></label>
        <label>Password<input name="password" type="password" autoComplete={login ? "current-password" : "new-password"} placeholder="At least 6 characters" disabled={loading} /></label>
        <button className="button primary full" disabled={loading}>{loading ? <Spinner label={login ? "Signing in…" : "Creating account…"} /> : login ? "Sign in" : "Create account"}</button>
      </form>
      <p className="auth-switch">{login ? "New to Voxora?" : "Already have an account?"} <Link href={login ? "/register" : "/login"}>{login ? "Create an account" : "Sign in"}</Link></p>
    </div></section></main>;
}
