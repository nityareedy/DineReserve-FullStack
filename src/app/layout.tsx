'use client';
import "./globals.css";
import Navbar from "@/components/Navbar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/toaster"
import { Footer } from "@/components/Footer"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const routerConfig = extractRouterConfig(ourFileRouter);

  return (
    <html lang="en">
      <body>
        <Navbar />
        <Analytics />
        <SpeedInsights/>
        <NextSSRPlugin routerConfig={routerConfig} />
        <div className="flex flex-col min-h-screen">
          {children}
          <Toaster />
        </div>
        <Footer />
      </body>
    </html>
  );
}