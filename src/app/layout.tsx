import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import NavbarAside from "@/section/NavbarAside";

export const metadata: Metadata = {
  title: "Blog",
  description: "Generated by",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} antialiased scroll-custom`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TRPCReactProvider>
          <NavbarAside>
            {children}
          </NavbarAside>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
