"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "./Brand";
import { clearSession, getStoredUser, hasSession } from "../services/api";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const pathname = usePathname(); const [ready, setReady] = useState(false); const [open, setOpen] = useState(false);
  useEffect(() => { if (!hasSession()) router.replace(`/login?returnTo=${encodeURIComponent(pathname)}`); else setReady(true); }, [pathname, router]);
  if (!ready) return <main className="center-screen"><span className="spinner" /><p>Opening your workspace…</p></main>;
  const user = getStoredUser();
  const logout = () => { clearSession(); router.replace("/login"); };
  return <div className="app-frame">
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="sidebar-top"><Brand /><button className="icon-button mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation">×</button></div>
      <nav aria-label="Main navigation">
        <Link className={pathname === "/app" ? "nav-link active" : "nav-link"} href="/app" onClick={() => setOpen(false)}><span>▦</span>Library</Link>
        <Link className={pathname === "/app/upload" ? "nav-link active" : "nav-link"} href="/app/upload" onClick={() => setOpen(false)}><span>＋</span>New document</Link>
      </nav>
      <div className="sidebar-account"><span className="avatar">{user?.email?.[0]?.toUpperCase() || "U"}</span><span className="account-copy"><strong>My workspace</strong><small>{user?.email}</small></span><button className="icon-button" onClick={logout} title="Sign out" aria-label="Sign out">↗</button></div>
    </aside>
    {open && <button className="scrim" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <div className="app-content"><header className="mobile-header"><button className="icon-button" onClick={() => setOpen(true)} aria-label="Open navigation">☰</button><Brand compact /><Link className="mini-upload" href="/app/upload">＋</Link></header>{children}</div>
  </div>;
}
