'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useIsMobile } from '@/hook/use-mobile';
import { BlogCore } from '@/types/helper.type';
import { Card } from '@/components/ui/card';

interface BlogHeaderProps {
    blog: BlogCore | null;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ blog }) => {
    const isMobile = useIsMobile();

    const blogTagsMemo = useMemo(() => {
        if (!blog?.tags) return [];
        const tagsToShow = isMobile ? 3 : 5;
        return blog.tags.slice(0, tagsToShow).map((tag: { name: string }, index: number) => (
            <Card
                key={`${tag.name}-${index}`}
                className="px-2 py-1 text-xs font-medium text-[#3A6B4C] rounded-full transition-colors"
            >
                #{tag.name.toUpperCase()}
            </Card>
        ));
    }, [blog?.tags, isMobile]);

    const remainingTagsCount = useMemo(() => {
        if (!blog?.tags) return 0;
        const tagsToShow = isMobile ? 3 : 5;
        return Math.max(0, blog.tags.length - tagsToShow);
    }, [blog?.tags, isMobile]);

    if (!blog) return null;

    return (
        <>
            <div className="mb-6">
                <Link href="/" passHref legacyBehavior>
                    <a className="inline-flex items-center text-sm text-[#3A6B4C] hover:underline transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Về trang chủ
                    </a>
                </Link>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {blogTagsMemo}
                {remainingTagsCount > 0 && (
                    <Link
                        href="/tags"
                        className="text-xs text-gray-500 self-center underline hover:text-gray-700"
                        title="View all tags"
                    >
                        + {remainingTagsCount} more
                    </Link>
                )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight blog-title">
                {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 mb-8 text-sm md:text-base">
                {blog.author?.name && (
                    <div className="flex items-center gap-2">
                         {blog.author.image && (
                             <Image
                                src={blog.author.image}
                                alt={`${blog.author.name}'s avatar`}
                                width={24}
                                height={24}
                                className="rounded-full object-cover"
                                quality={75}
                                unoptimized={blog.author.image.startsWith('/')}
                            />
                         )}
                        <span>By {blog.author.name}</span>
                        <span className="h-1 w-1 bg-gray-400 rounded-full" />
                    </div>
                )}
                <time dateTime={new Date(blog.publishDate).toISOString()} className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(blog.publishDate).toLocaleDateString('vi-VN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </time>
                {blog.readTime && (
                    <>
                      <span className="h-1 w-1 bg-gray-400 rounded-full" />
                      <span>{blog.readTime} phút đọc</span>
                    </>
                )}
            </div>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-gray-200 pl-4 italic blog-meta-description">
                {blog.metaDescription}
            </p>
        </>
    );
};

export default BlogHeader;