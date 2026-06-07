import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Zakovat by LRC Studio",
  description: "Академический дашборд интеллектуальных игр",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <AppLayout>{children}</AppLayout>
        </StoreProvider>
      </body>
    </html>
  );
}
