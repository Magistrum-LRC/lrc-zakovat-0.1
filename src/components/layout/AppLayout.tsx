"use client";

import { TopNavbar } from "./TopNavbar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNavbar />
      <main className="flex-1 pt-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}
