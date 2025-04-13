import React, { Suspense } from "react";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import AppSidebarProvider from "@/provider/app.sidebar";
import { auth } from "@/server/auth";
import { SessionProvider } from "next-auth/react";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify';
import Spinner from "@/components/Snipper";

export const metadata: Metadata = {
  title: "BloAI Blog - Kiến thức AI từ Cơ bản đến Nâng cao",
  description: "Khám phá cách sử dụng AI trong mọi lĩnh vực, hướng dẫn chi tiết về Trí tuệ Nhân tạo, và ứng dụng thực tế của AI vào công việc và cuộc sống.",
  keywords: "AI, Trí tuệ Nhân tạo, Ứng dụng AI, Hướng dẫn AI, Công nghệ AI, Machine Learning, AI cho Doanh nghiệp, AI trong Y tế, AI Giáo dục, Phát triển AI",
  authors: [{ name: "BloAI Team" }],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://bloai.blog',
    siteName: 'BloAI Blog',
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/images/Logo/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/images/Logo/favicon-32x32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/images/Logo/favicon-16x16.png" },
    { rel: "manifest", url: "/site.webmanifest" }
  ],
  metadataBase: new URL('https://bloai.blog'),
};

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
})
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="vi" className={`${inter.className} antialiased scroll-custom`} suppressHydrationWarning>
        <body className="bg-gray-50" suppressHydrationWarning>
          <TRPCReactProvider>
            <main>
              <AppSidebarProvider>
                <Suspense fallback={<Spinner />}> 
                  {children}
                </Suspense>
                <ToastContainer/>
                <Analytics />
                <SpeedInsights />
              </AppSidebarProvider>
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </SessionProvider>
  );
}