import React from 'react';
import { ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; 

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1, 
  totalPages = 1,
  onPageChange,
}) => {

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5; 
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages + 2) { 
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > halfVisible + 2) {
        pages.push('...');
      }

      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      if (currentPage <= halfVisible + 1) {
         endPage = Math.min(totalPages - 1, maxVisiblePages);
      }
      if (currentPage >= totalPages - halfVisible) {
         startPage = Math.max(2, totalPages - maxVisiblePages + 1);
      }


      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - halfVisible - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center  gap-1">
        <Button
          variant="outline"
          size="icon" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
              ...
            </span>
          ) : (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'} 
            size="icon" 
            onClick={() => onPageChange(page as number)}
            className={cn(
              'h-9 w-9 p-0',
              page === currentPage
                ? 'bg-[#3A6B4C] text-white hover:bg-[#2E5540] dark:bg-[#4F7359] dark:hover:bg-[#3A6B4C]'
                : 'border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={page === currentPage ? `Current page, Page ${page}` : `Go to page ${page}`}
          >
            {page}
          </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon" 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-9 w-9 p-0 border-[#e4d9c8] text-[#554640] hover:bg-[#3A6B4C]/10 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

       
      <div className="flex items-center gap-2 text-sm text-[#554640]/80">
        <Sprout className="h-4 w-4 text-[#3A6B4C]" />
        <span>{totalPages * 10} opportunities blog</span>
      </div>
    </div>
  );
};

export default Pagination;