'use client';

import React, { useCallback } from 'react';
import { Share, Eye as EyeIcon } from 'lucide-react';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { BlogCore } from '@/types/helper.type';

interface BlogShareSidebarProps {
    blog: BlogCore | null;
    views: number | null;
}

const BlogShareSidebar: React.FC<BlogShareSidebarProps> = ({ blog, views }) => {

    const handleShare = useCallback(() => {
        if (navigator.clipboard && window.location.href) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Đã sao chép liên kết vào clipboard!'))
                .catch(err => console.error('Failed to copy link: ', err));
        } else {
            alert('Không thể sao chép liên kết trên trình duyệt này.');
        }
    }, []);

    if (!blog) return null;

    const encodedUrl = encodeURIComponent(blog.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : ''));
    const encodedTitle = encodeURIComponent(blog.title);

    return (
        <aside className="sticky top-28 hidden lg:block w-16 shrink-0 -ml-20 mr-4 h-[calc(100vh-10rem)] self-start">
            <div className="flex flex-col items-center justify-start pt-4 gap-8 h-full">
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleShare}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label="Copy link to share this article"
                        title="Copy Link"
                    >
                        <Share className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                    </button>

                    <div className="flex flex-col items-center gap-1 text-gray-500" title="Approximate Views">
                        <EyeIcon className="w-5 h-5" />
                        <span className="text-xs font-medium">
                            {views === null ? '...' : views.toLocaleString()}
                        </span>
                    </div>

                    <div className="h-px w-6 bg-linear-to-r from-transparent via-gray-300 to-transparent my-2" />

                    <div className="flex flex-col gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label="Share on Twitter"
                            title="Share on Twitter"
                        >
                            <FaTwitter className="w-5 h-5 text-gray-500 hover:text-[#1DA1F2]" />
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label="Share on Facebook"
                            title="Share on Facebook"
                        >
                            <FaFacebook className="w-5 h-5 text-gray-500 hover:text-[#1877F2]" />
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label="Share on LinkedIn"
                            title="Share on LinkedIn"
                        >
                            <FaLinkedin className="w-5 h-5 text-gray-500 hover:text-[#0A66C2]" />
                        </a>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default BlogShareSidebar;