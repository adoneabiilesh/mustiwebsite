import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { I18nProvider } from '@/lib/i18n';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "LEVEL | High-Performance Food Delivery",
    template: "%s | LEVEL"
  },
  description: "Order bold flavors from local restaurants. Fast, high-quality food delivery for those who level up their lunch.",
  keywords: ["food delivery", "restaurant", "menu", "order food online", "fast delivery", "local eats"],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-muted-cream text-dead-black antialiased`}>
        <I18nProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              className: 'border-2 border-dead-black rounded-xl font-black uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
            }}
          />
          <Header />
          <main className="min-h-screen pt-20 md:pt-24 pb-32 md:pb-12 px-4 max-w-7xl mx-auto">
            {children}
          </main>
          <BottomNav />
          <Analytics />
          <SpeedInsights />
        </I18nProvider>
      </body>
    </html>
  );
}
