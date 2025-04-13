'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterTag {
  label: string;
  value: string;
}

interface BlogFilterBarProps {
  tags: FilterTag[];
  activeFilter: string;
  onFilterChange: (filterValue: string) => void;
  maxVisibleTags?: number;
  moreTagsLink?: string;
}

export function BlogFilterBar({
  tags,
  activeFilter,
  onFilterChange,
  maxVisibleTags = 12,
  moreTagsLink = '/tags'
}: BlogFilterBarProps) {

  if (!tags || tags.length === 0) {
    return null;
  }

  const allTag: FilterTag = { label: 'Tất cả bài viết', value: 'Tất cả bài viết' };
  const visibleTags = [allTag, ...tags.slice(0, maxVisibleTags - 1)];
  const hasMoreTags = tags.length > maxVisibleTags - 1;

  const handleFilterClick = (tagValue: string) => {
    onFilterChange(activeFilter === tagValue ? '' : tagValue);
  };

  return (
    <div className="pt-12 pb-16 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        <h1 className='text-4xl md:text-5xl font-bold leading-tight text-[#2B463C] mb-4'>
          Khám Phá Thế Giới Trí Tuệ Nhân Tạo
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">
          Cập nhật kiến thức mới nhất về AI/ML cùng cộng đồng{' '}
          <span className='font-semibold text-[#3A6B4C]'>AI Expert</span><br />
          Khám phá các chủ đề từ Machine Learning đến Đạo đức AI
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {visibleTags.map((tag) => (
            <Button
              key={tag.value}
              variant={tag.value === activeFilter ? 'default' : 'outline'}
              size="sm"
              className={`rounded-full h-auto py-1.5 px-4 font-medium transition-colors duration-150 ease-in-out
                ${tag.value === activeFilter
                  ? 'bg-[#3A6B4C] text-white hover:bg-[#3A6B4C]/90 border-[#3A6B4C]'
                  : 'hover:text-gray-800'
                }
              `}
              onClick={() => handleFilterClick(tag.value)}
            >
              {tag.label}
            </Button>
          ))}
          {hasMoreTags && (
            <Link href={moreTagsLink}>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full h-auto py-1.5 px-4 font-medium transition-colors duration-150 ease-in-out hover:text-gray-800"
              >
                Xem thêm
              </Button>
            </Link>
          )}
        </div>

        <div className="text-[#2B463C] p-4 rounded-lg text-center max-w-3xl mx-auto border">
          <p className='text-sm sm:text-base'>
            Bạn có chuyên môn về AI? Chia sẻ kiến thức với cộng đồng{' '}
            <Link 
              href="#" 
              className="font-semibold text-[#3A6B4C] underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A6B4C] rounded"
            >
              Đóng góp bài viết ngay
            </Link>
            <span role="img" aria-label="robot" className='ml-1 relative top-0.5'>🤖</span>
          </p>
        </div>
      </div>
    </div>
  );
}