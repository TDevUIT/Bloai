"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/lib/route';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const AppSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const newPost = pathname.split('/')[1] as string;

  if (isAuthRoute) {
    return <div>{children}</div>;
  }

  return (
    <>
      {newPost === 'new-post' ? (
        <div className="px-6">
          {children}
        </div>
      ) : (
        <div className="container mx-auto max-w-7xl">
          <Navbar />
          {children}
          <Footer />
        </div>
      )}
    </>
  );
};

export default AppSidebarProvider;
