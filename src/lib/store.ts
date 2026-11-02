"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppView, SessionUser } from "./types";

interface AppState {
  // navigation
  activeView: AppView;
  setActiveView: (v: AppView) => void;

  // session
  session: SessionUser | null;
  setSession: (u: SessionUser | null) => void;
  logout: () => void;

  // active case for case detail pages
  activeCaseCode: string | null;
  setActiveCaseCode: (c: string | null) => void;

  // sidebar collapsed (mobile drawer)
  sidebarOpen: boolean;
  setSidebarOpen: (o: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeView: "home",
      setActiveView: (v) => set({ activeView: v }),
      session: null,
      setSession: (u) => set({ session: u }),
      logout: () =>
        set({ session: null, activeView: "home", activeCaseCode: null }),
      activeCaseCode: null,
      setActiveCaseCode: (c) => set({ activeCaseCode: c }),
      sidebarOpen: false,
      setSidebarOpen: (o) => set({ sidebarOpen: o }),
    }),
    {
      name: "ghana-lex-ai",
      partialize: (s) => ({
        session: s.session,
        activeView: s.activeView,
        activeCaseCode: s.activeCaseCode,
      }),
    },
  ),
);
