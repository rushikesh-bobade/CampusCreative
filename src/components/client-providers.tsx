"use client";

import { ThemeProvider } from "./theme-provider";
import { MainLayout } from "./main-layout";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MainLayout>{children}</MainLayout>
      <Toaster position="top-center" richColors />
    </ThemeProvider>
  );
}
