'use client'

import React, { useMemo, useState } from 'react';
import { BentoGrid } from "../ui/bento-grid"; 
import { api } from '@/trpc/react';
import Pagination from '../Pagintion'; 
import Loading from '../loading'; 

import { Button } from '../ui/button';
import { BlogFilterBar } from './BlogFilterBar';
import { BlogCard } from './BlogCard';


const LIMIT = 9;

export function BlogGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('');

  const { data: blogData, isLoading, error, isFetching } = api.blog.getAllBlog.useQuery({
    page: currentPage,
    limit: LIMIT
  });


  const filterTags = useMemo(() => {
    if (!blogData?.blogs || blogData.blogs.length === 0) {
      return [];
    }
    const allTagNames = blogData.blogs.flatMap((blog) => blog.tags.map((tag) => tag.name));
    const uniqueTagNames = Array.from(new Set(allTagNames));
    return uniqueTagNames.map((tagName) => ({
      label: tagName,
      value: tagName.toLowerCase().replace(/ /g, '-'),
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [blogData?.blogs]);

  const filteredBlogs = useMemo(() => {
    if (!blogData?.blogs) return [];
    if (!activeFilter) return blogData.blogs;

    return blogData.blogs.filter(blog =>
      blog.tags.some(tag =>
        tag.name.toLowerCase().replace(/ /g, '-') === activeFilter
      )
    );
  }, [blogData?.blogs, activeFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  if (isLoading) return <Loading />;

  if (error || !blogData) {
    return (
      <div className='h-[calc(100vh-80px)] w-full flex justify-center items-center text-center px-4'>
        <p className="text-red-600 text-lg">
          {error ? `Error loading blogs: ${error.message}` : 'Could not load blog posts. Please try again later.'}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(blogData.total / LIMIT);

  return (
    <>
      <div className="pt-4 px-4 text-center">
          <BlogFilterBar
            tags={filterTags}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
             moreTagsLink="/tags" 
          />
      </div>
      {isFetching && !isLoading && (
        <div className="text-center py-4 text-gray-500">Updating posts...</div>
      )}
      <BentoGrid className="px-4 pb-16">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            
            <BlogCard key={blog.id} blog={blog} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {activeFilter
              ? `No blog posts found for the tag "${activeFilter.replace(/-/g, ' ')}".`
              : 'No blog posts found.'}
            {activeFilter && (
                 <Button variant="link" onClick={() => setActiveFilter('')} className="ml-2">
                    Clear filter
                 </Button>
             )}
          </div>
        )}
      </BentoGrid>
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto my-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </>
  );
}