import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Clock, Lock, LogOut, Menu, Radar, ShieldCheck, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useSession } from "@/hooks/useSession";
import { ROLE_LABEL, getDemoUser } from "@/services/authService";
import { NAV } from "./nav";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

export function AppLayout({ role, children }: { role: Role; children: ReactNode }) {
  const { role: sessionRole, setRole } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (sessionRole === null) {
      navigate({ to: "/login", replace: true });
    } else if (sessionRole !== role) {
      setRole(role);
    }
  }, [role, sessionRole, setRole, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const [istTime, setIstTime] = useState(() =>
    new Date().toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const user = getDemoUser(role);
  const items = NAV[role];


  if (sessionRole !== role) return null;

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
          <Radar className="size-5" />
        </span>
        <div>
          <p className="font-display text-base font-semibold leading-tight text-white">
            SentinelWell
          </p>
          <p className="text-[11px] uppercase tracking-widest text-sidebar-primary">
            {ROLE_LABEL[role]}
          </p>
        </div>
        <button
          className="ml-auto lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
              {active ? <span className="ml-auto h-4 w-1 rounded-full bg-sidebar-primary" /> : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <div className="flex items-start gap-2 rounded-lg bg-sidebar-accent/60 px-3 py-2.5">
          <Lock className="mt-0.5 size-3.5 text-sidebar-primary" />
          <p className="text-[11px] leading-snug text-sidebar-foreground/80">
            Role-based access active. Data visibility is limited to your authorisation level.
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white"
          onClick={() => {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem("sentinelwell.role");
              window.localStorage.removeItem("sentinelwell.token");
            }
            setRole(null);
            navigate({ to: "/login", replace: true });
          }}
        >
          <LogOut className="size-4" />
          Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{sidebar}</aside>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-navy/50"
            onClick={() => setOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="absolute inset-y-0 left-0 w-72">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/85 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu className="size-5" />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 sm:flex">
            <ShieldCheck className="size-3.5 text-risk-low" />
            <span className="text-[11px] font-medium text-muted-foreground">
              Confidential · Access logged
            </span>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-border/80 bg-surface/60 px-3 py-1 text-xs text-muted-foreground md:flex">
            <Clock className="size-3.5 text-primary" />
            <span className="font-mono text-[11px] font-medium text-foreground">{istTime}</span>
            <span className="text-[10px] text-muted-foreground font-semibold">IST</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <NotificationDropdown />
            <div className="flex items-center gap-2.5 rounded-full border border-border py-1 pl-1 pr-3">
              <span className="grid size-7 place-items-center rounded-full bg-navy text-[11px] font-semibold text-navy-foreground">
                {user.serviceId.slice(0, 2)}
              </span>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-semibold leading-tight">{user.serviceId}</p>
                <p className="text-[10px] leading-tight text-muted-foreground">
                  {ROLE_LABEL[role]}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
