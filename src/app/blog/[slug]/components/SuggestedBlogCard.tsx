// components/blog/SuggestedBlogCard.tsx
import React from 'react';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { SuggestedBlog } from '@/types/helper.type';

interface SuggestedBlogCardProps {
    post: SuggestedBlog;
}

const SuggestedBlogCard: React.FC<SuggestedBlogCardProps> = ({ post }) => {
    return (
        <article key={post.slug} className="group">
            <Link
                href={`/blog/${post.slug}`}
                className="flex gap-3 items-start group"
                aria-label={`Đọc bài viết: ${post.title}`}
            >
                {post.imageUrl && (
                    <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden relative border border-gray-100">
                        <CldImage
                            width={200}
                            height={150}
                            src={post.imageUrl}
                            alt={post.imageAlt || `Thumbnail for ${post.title}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                            sizes="(max-width: 640px) 64px, 80px"
                            quality={70}
                        />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-150 group-hover:underline underline-offset-2">
                        {post.title}
                    </h3>
                    <div className="flex items-center mt-1.5 text-xs text-gray-500">
                        <time dateTime={new Date(post.publishDate).toISOString()}>
                            {new Date(post.publishDate).toLocaleDateString('vi-VN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            })}
                        </time>
                        <span className="mx-1.5">•</span>
                        <span>{post.readTime} phút đọc</span>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default SuggestedBlogCard;