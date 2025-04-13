'use client';

import { useCurrentUser } from '@/hook/use-current-user';
import Link from 'next/link';
import { FaSearch, FaBell, FaUser, FaSignOutAlt, FaRegWindowRestore, FaPenNib } from 'react-icons/fa';
import { signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { useIsMobile } from '@/hook/use-mobile';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Logo from '@/components/logo'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

const Navbar = () => {
  const user = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        "h-14 min-[375px]:h-16 bg-transparent flex items-center justify-between relative",
        "px-2 min-[375px]:px-4 md:px-6 lg:px-8",
        "top-0 left-0 w-full z-20" 
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center shrink-0">
        <Link
          href="/"
          className='hover:opacity-80 transition-opacity' 
          aria-label="Bloai Home Page"
        >
          <Logo />
        </Link>
      </div>

      {!isMobile && (
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <label htmlFor="main-search" className="sr-only">Search content</label>
            <Input
              id="main-search"
              type="search"
              name="search"
              placeholder="Search..."
              className="w-full rounded-lg
                       py-1.5 min-[375px]:py-2
                       px-3 min-[375px]:px-4
                       pl-8 min-[375px]:pl-10
                       text-sm min-[375px]:text-base
                       max-w-sm
                       "
              aria-label="Search articles"
            />
            <FaSearch
              className="absolute left-2.5 min-[375px]:left-3 top-1/2 -translate-y-1/2
                        w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 min-[375px]:gap-4 shrink-0">
        <button
          className="hidden sm:flex p-1.5 min-[375px]:p-2 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="Notifications"
        >
          <FaBell className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" />
        </button>

        {user ? (
          <div className="relative flex gap-x-4" ref={dropdownRef}>
            <Link href='/new-post'>
              <Button
                  variant="outline"
                  className="border-[#3A6B4C] text-[#3A6B4C] hover:bg-[#3A6B4C]/10 gap-2 cursor-pointer"
              >
                  <FaPenNib className="h-4 w-4" />
                  <span className="sr-only md:not-sr-only">Tạo Blog</span>
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="User menu"
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name}'s avatar`}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  priority
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center  rounded-full border ">
                  <FaUser className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </button>

            {isOpen && (
              <Card
                className="absolute right-4 top-10 mt-2 w-64 rounded-lg shadow-xl border bg-transparent"
              >
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900 truncate" role="none">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate" role="none">{user.email}</p>
                </div>
                <div className="py-1" role="none">
                  <button
                    onClick={() => signOut()}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150" 
                    role="menuitem"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                    Sign out
                  </button>
                </div>
              </Card>
            )}
          </div>
        ) : (
          <Link href='/auth/signin'
            aria-label="Sign in"
          >
            <Button
                variant="outline"
                className="border-[#3A6B4C] text-[#3A6B4C] hover:bg-[#3A6B4C]/10 gap-2 cursor-pointer"
            >
                <FaPenNib className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Đăng Nhập</span>
            </Button>
        </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;