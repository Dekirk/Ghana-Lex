"use client";
import { SiteHeader } from "@/components/site/header";
import { Sidebar } from "@/components/site/sidebar";
import { SiteFooter } from "@/components/site/footer";
import { HomeView } from "@/components/views/home-view";
import { AiSearchView } from "@/components/views/ai-search-view";
import { ClientPortalView } from "@/components/views/client-portal-view";
import { CaseManagementView } from "@/components/views/case-management-view";
import { PartiesView } from "@/components/views/parties-view";
import { CaseTrackingView } from "@/components/views/case-tracking-view";
import { RemindersView } from "@/components/views/reminders-view";
import { BillingView } from "@/components/views/billing-view";
import { useAppStore } from "@/lib/store";

export default function Page() {
  const activeView = useAppStore((s) => s.activeView);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          {activeView === "home" && <HomeView />}
          {activeView === "ai-search" && <AiSearchView />}
          {activeView === "client-portal" && <ClientPortalView />}
          {activeView === "case-management" && <CaseManagementView />}
          {activeView === "parties" && <PartiesView />}
          {activeView === "case-tracking" && <CaseTrackingView />}
          {activeView === "reminders" && <RemindersView />}
          {activeView === "billing" && <BillingView />}
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
