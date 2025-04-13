import React, { Suspense } from "react";
import "@/styles/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ToastContainer } from 'react-toastify';
import { GoogleAnalytics } from '@next/third-parties/google'
import Loading from "@/components/loading";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import {
  rootLayoutMetadata,
  websiteSchemaLd,
  organizationSchemaLd,
  breadcrumbSchemaLd,
  safeJsonLdStringify 
} from '@/config/seo'; 

export const metadata = rootLayoutMetadata;

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  });
  
  const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  });


export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="vi" className={`${nunito.variable} ${ptSans.variable} antialiased scroll-custom`} suppressHydrationWarning>
        <head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(websiteSchemaLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(organizationSchemaLd) }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchemaLd) }}
            />
          </head>
        <body className="" suppressHydrationWarning>
          <TRPCReactProvider>
              <AppSidebarProvider>
                <Suspense fallback={<Loading />}>
                  <div className="texture" />
                    {children}
                </Suspense>
                <ToastContainer/>
                <Analytics />
                <SpeedInsights />
                <GoogleAnalytics gaId="G-CL7D21ZY78" />
              </AppSidebarProvider>
          </TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}