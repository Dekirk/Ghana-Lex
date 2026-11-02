"use client";
import Link from "next/link";
import { Scale, Menu, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { ROLE_LABELS, type AppView } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "./sidebar";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "ai-search", label: "AI Legal Search" },
  { id: "client-portal", label: "Client Portal" },
  { id: "case-management", label: "Cases" },
  { id: "parties", label: "Parties & Evidence" },
  { id: "case-tracking", label: "Case Tracking" },
  { id: "reminders", label: "Reminders" },
  { id: "billing", label: "Billing" },
];

export function SiteHeader() {
  const session = useAppStore((s) => s.session);
  const logout = useAppStore((s) => s.logout);
  const setActiveView = useAppStore((s) => s.setActiveView);
  const activeView = useAppStore((s) => s.activeView);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-sidebar/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile sidebar trigger */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-4">
              <SheetTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                GhanaLex AI
              </SheetTitle>
            </SheetHeader>
            <div className="px-2">
              <SidebarNav onNavigate={() => setSidebarOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        <button
          onClick={() => setActiveView("home")}
          className="flex items-center gap-2"
          aria-label="GhanaLex AI home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Scale className="h-5 w-5" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold tracking-tight">
              GhanaLex AI
            </span>
            <span className="text-[11px] text-muted-foreground">
              Legal Research &amp; Case Management
            </span>
          </span>
        </button>

        <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "secondary" : "ghost"}
              size="sm"
              className={activeView === item.id ? "font-medium" : ""}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1 sm:flex">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">
                  {session.fullName}
                </span>
                <Badge
                  variant="outline"
                  className="border-primary/40 text-[10px] text-primary"
                >
                  {ROLE_LABELS[session.role]}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  setActiveView("home");
                }}
              >
                <LogOut className="mr-1 h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => setActiveView("client-portal")}>
              <ShieldCheck className="mr-1 h-4 w-4" /> Secure Sign-in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
