'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaPenAlt, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import Logo from '@/components/logo'; 
import { Button } from './ui/button';
import Search from './Search';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';
import { Home, Tags, Info, PenLine } from "lucide-react";

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node) && 
          !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "h-14 min-[375px]:h-16 bg-white border-b border-black/10 flex items-center justify-between",
          "px-2 min-[375px]:px-4 md:px-6 lg:px-8 shadow-sm",
          "fixed top-0 left-0 w-full z-30 " 
        )}
        aria-label="Main navigation"
      >
        <div className="flex items-center lg:flex-shrink-0 lg:max-w-6xl lg:w-full">
          <Logo />
          {!isMobile && (
            <div className="hidden md:flex items-center ml-8 space-x-6">
              <Link 
                href="/" 
                className={cn(
                  "text-gray-600 hover:text-[#3A6B4C] transition-colors flex items-center gap-1",
                  pathname === "/" && "text-[#3A6B4C] font-medium"
                )}
              >
                <FaHome className="w-4 h-4" />
                <span>Trang chủ</span>
              </Link>
              <Link
                href="/tags"
                className={cn(
                  "text-gray-600 hover:text-[#3A6B4C] transition-colors",
                  pathname === "/tags" && "text-[#3A6B4C] font-medium"
                )}
              >
                Danh Mục
              </Link>
              <Link
                href="/about"
                className={cn(
                  "text-gray-600 hover:text-[#3A6B4C] transition-colors",
                  pathname === "/about" && "text-[#3A6B4C] font-medium"
                )}
              >
                Về chúng tôi
              </Link>
            </div>
          )}
            {!isMobile && (
            <div className="flex-1 mx-4 ">
              <Search />
            </div>
          )}
        </div>
       
        <div className="flex items-center justify-end gap-2 min-[375px]:gap-4 flex-shrink-0">
          {isMobile && (
            <>
              {/* <Button 
                variant="ghost"
                className={cn(
                  "p-1.5 text-gray-600 hover:text-[#3A6B4C] transition-colors",
                  pathname === "/search" && "text-[#3A6B4C]"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href="/search">
                  <FaSearch className="w-4 h-4" aria-label="Search" />
                </Link>
              </Button> */}
              
              <Button 
                variant="ghost"
                className="p-1.5 text-gray-600 hover:text-[#3A6B4C] transition-colors mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <FaTimes className="w-4 h-4" />
                ) : (
                  <FaBars className="w-4 h-4" />
                )}
              </Button>
            </>
          )}

          {user ? (
            <div className="relative flex gap-x-4 justify-center items-center" ref={dropdownRef}>
              {!isMobile && (
                <Button 
                  asChild 
                  className={cn(
                    'bg-[#3A6B4C] text-white hover:bg-[#3A6B4C]/90',
                    pathname === "/new-post" && "bg-[#3A6B4C]/80"
                  )}
                >
                  <Link href='/new-post'>
                    <FaPenAlt className="w-4 h-4" />
                    <span className="hidden sm:inline">Viết Blog</span>
                  </Link>
                </Button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="User menu"
                aria-haspopup="true"
                aria-expanded={isOpen}
              >
                <Avatar className='h-8 w-8'>
                  <AvatarImage 
                    src={user.image || 'https://res.cloudinary.com/dq2z27agv/image/upload/q_auto,f_webp,w_auto/v1746885273/y3hpblcst5qn3j5aah1l.svg'} 
                    alt={user.name || 'User avatar'}
                  />
                  <AvatarFallback className="bg-gray-200">
                    {user.name ? (
                      user.name.split(' ').map(n => n[0]).join('')
                    ) : (
                      <FaUser className="w-4 h-4 text-gray-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </button>

              {isOpen && (
                <div
                  className="absolute right-0 top-10 w-64 bg-white rounded-lg shadow-xl border border-gray-200 divide-y divide-gray-100 z-40"
                  role="menu"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    {/* <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A6B4C] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <FaUser className="w-4 h-4 mr-3 text-gray-400 inline" />
                      Profile
                    </Link> */}
                    {isMobile && (
                      <Link
                        href="/new-post"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#3A6B4C] transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <FaPenAlt className="w-4 h-4 mr-3 text-gray-400 inline" />
                        Viết Blog
                      </Link>
                    )}
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors" 
                    >
                      <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className={cn(
                "px-3 py-1.5 min-[375px]:px-4 min-[375px]:py-2 text-sm min-[375px]:text-base text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-colors border-2 border-black rounded-sm",
                pathname === "/auth/signin" && "bg-blue-50 text-blue-600"
              )}
            >
              <span className='font-medium'>Đăng Nhập</span>
            </Link>
          )}
        </div>
      </nav>

      {isMobile && isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed top-16 left-0 w-full bg-white shadow-lg z-20 border-t border-gray-200 animate-in slide-in-from-top-2"
        >
          <div className="px-4 py-3 space-y-4">
            <Link 
              href="/" 
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A6B4C] transition-colors",
                pathname === "/" && "text-[#3A6B4C] font-medium"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={18} />
              Trang chủ
            </Link>
            <Link
              href="/tags"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A6B4C] transition-colors",
                pathname === "/tags" && "text-[#3A6B4C] font-medium"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Tags size={18} />
              Danh Mục
            </Link>
            <Link
              href="/about"
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A6B4C] transition-colors",
                pathname === "/about" && "text-[#3A6B4C] font-medium"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Info size={18} />
              Về chúng tôi
            </Link>
            {user && (
              <Link
                href="/new-post"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#3A6B4C] transition-colors",
                  pathname === "/new-post" && "text-[#3A6B4C] font-medium"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <PenLine size={18} />
                Viết Blog
              </Link>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default Navbar;