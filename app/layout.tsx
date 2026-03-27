import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ConnectivityMonitor } from "@/components/shared/connectivity-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropTech | Indian Real Estate Platform",
  description: "Buy, sell and rent properties in India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <CookieConsent />
            <ScrollToTop />
            <ConnectivityMonitor />
            <Toaster />
            <SonnerToaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
