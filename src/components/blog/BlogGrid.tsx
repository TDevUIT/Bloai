'use client'

import React, { useMemo, useState } from 'react';
import { BentoGrid } from "../ui/bento-grid"; 
import { api } from '@/trpc/react';
import Pagination from '../Pagintion'; 
import { Button } from '../ui/button';
import { BlogFilterBar } from './BlogFilterBar';
import { BlogCard } from './BlogCard';
import { FileWarningIcon } from 'lucide-react';


const LIMIT = 9;

export function BlogGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('Tất cả bài viết');

  const { data: blogData, isLoading, error, isFetching } = api.blog.getAllBlog.useQuery({
    page: currentPage,
    limit: LIMIT
  });

  const filterTags = useMemo(() => {
    if (!blogData?.blogs || blogData.blogs.length === 0) return [];
    const allTagNames = blogData.blogs.flatMap((blog) => blog.tags.map((tag) => tag.name));
    return Array.from(new Set(allTagNames))
      .map((tagName) => ({
        label: tagName,
        value: tagName.toLowerCase().replace(/ /g, '-'),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [blogData?.blogs]);

  const filteredBlogs = useMemo(() => {
    if (!blogData?.blogs) return [];
    if (!activeFilter || activeFilter === 'Tất cả bài viết') return blogData.blogs;
    return blogData.blogs.filter(blog =>
      blog.tags.some(tag => tag.name.toLowerCase().replace(/ /g, '-') === activeFilter
    ));
  }, [blogData?.blogs, activeFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error || !blogData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <FileWarningIcon className="h-12 w-12 text-red-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-red-600">
            {error ? "Failed to load posts" : "No posts found"}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {error?.message || "Please check back later or try refreshing the page."}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(blogData.total / LIMIT);

  return (
    <section className="">
      <div className="mb-12 text-center">
        <BlogFilterBar
          tags={filterTags}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {isFetching && (
        <div className="text-center py-4 text-gray-500 animate-pulse">
          Đang tải bài viết mới...
        </div>
      )}
       <h2 className="text-3xl font-bold text-[#2B463C] mb-2">
          Bài Viết Mới Nhất
      </h2>
      <p className="text-gray-600 mb-8">
          Cập nhật những nghiên cứu mới nhất về Trí Tuệ Nhân Tạo và ứng dụng thực tiễn
          <span className="ml-2">🚀</span>
      </p>
      <BentoGrid className="px-4 md:px-0 mb-16">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </BentoGrid>

      {filteredBlogs.length === 0 && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-6xl">😕</div>
          <h3 className="text-xl font-semibold text-gray-800">
            Không tìm thấy bài viết phù hợp
          </h3>
          <p className="text-gray-600 max-w-md">
            Hãy thử xóa bộ lọc hoặc chọn chủ đề khác
          </p>
          <Button
            variant="outline"
            onClick={() => setActiveFilter('Tất cả bài viết')}
            className="mt-4"
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 border-t border-[#3A6B4C]/20 pt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
}

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="animate-pulse space-y-8">
      <div className="h-10 bg-gray-200 rounded w-1/4 mx-auto" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
      <div className="flex flex-wrap gap-4 justify-center">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded-full w-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-48 bg-gray-200 rounded-xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);