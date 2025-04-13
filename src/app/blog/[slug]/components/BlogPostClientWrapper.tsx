'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IconUserOff } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Loading from '@/components/loading'; 


import BlogMetadata from './BlogMetadata';
import BlogShareSidebar from './BlogShareSidebar';
import BlogHeader from './BlogHeader';
import BlogTableOfContents from './BlogTableOfContents';
import BlogContentRenderer from './BlogContentRenderer';
import BlogAuthorBioSection from './BlogAuthorBioSection';
import BlogSuggestedPosts from './BlogSuggestedPosts';
import ScrollToTopButton from './ScrollToTopButton';
import { Author, Blog, Heading, slugify, SuggestedBlog } from '@/types/helper.type';


interface BlogPostClientWrapperProps {
    blogData: Blog | null | undefined; 
    suggestedBlogsData?: SuggestedBlog[] | null | undefined;
}

const BlogPostClientWrapper: React.FC<BlogPostClientWrapperProps> = ({
    blogData: blog, 
    suggestedBlogsData: suggestedBlogs = []
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [views, setViews] = useState<number | null>(null);
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const extractedHeadings = useMemo(() => {
        if (!blog?.content || typeof blog.content !== 'string') {
            return [];
        }
        const headingRegex = /^(#{1,3})\s+(.+)/gm;
        const matches = Array.from(blog.content.matchAll(headingRegex) as IterableIterator<RegExpMatchArray>);
        const tempHeadings: Heading[] = [];
        const uniqueIds = new Set<string>();

        matches.forEach((match, index) => {
            const level = (match[1]?.length ?? 1) as 1 | 2 | 3;
            const text = match[2]?.trim() ?? '';
            if (!text) return;

            let id = slugify(text);
            if (!id) id = `heading-${index}`;

            let counter = 1;
            const originalId = id;
            while (uniqueIds.has(id)) {
                id = `${originalId}-${counter}`;
                counter++;
            }
            uniqueIds.add(id);

            tempHeadings.push({ level, text, id });
        });
        return tempHeadings;
    }, [blog?.content]);

    useEffect(() => {
        setHeadings(extractedHeadings);
    }, [extractedHeadings]);

    useEffect(() => {
        if (!blog?.slug) return;

        const storageKey = `blog-views-${blog.slug}`;
        const sessionViewKey = `blog-session-viewed-${blog.slug}`;
        let currentViews = 0;

        try {
            const storedViews = localStorage.getItem(storageKey);
            currentViews = storedViews ? parseInt(storedViews, 10) : 0;
            if (isNaN(currentViews)) currentViews = 0;

            const viewedInSession = sessionStorage.getItem(sessionViewKey);

            if (!viewedInSession) {
                currentViews += 1;
                localStorage.setItem(storageKey, currentViews.toString());
                sessionStorage.setItem(sessionViewKey, 'true');
            }
        } catch (error) {
            console.error("Error accessing storage for views:", error);
            currentViews = 0; 
        }
        setViews(currentViews);

    }, [blog?.slug]);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

     useEffect(() => {
        setIsMounted(true);
    }, []);


    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    if (!isMounted) {
         return <Loading />;
    }

    if (!blog) {
    
        return <Loading />;
    }

    const author = blog.author as Author | null; 

    if (!author) {
         return (
             <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6 rounded-lg shadow-xs border border-dashed border-amber-400 max-w-2xl mx-auto my-12">
                 <div className="inline-flex items-center gap-2 text-amber-600">
                     <IconUserOff stroke={1.5} className="w-10 h-10" />
                     <span className="text-2xl font-semibold">Author Information Unavailable</span>
                 </div>
                 <p className="max-w-md text-gray-700">
                     We couldn't load the author details for this post right now.
                 </p>
                 <Button
                     variant="outline"
                     className="text-blue-600 hover:text-blue-700 border-blue-500 hover:bg-blue-50 mt-4"
                     onClick={() => router.back()}
                 >
                     ← Go Back
                 </Button>
             </div>
         );
     }


    return (
        <>
            <BlogMetadata blog={blog} suggestedBlogs={suggestedBlogs} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-x-8 lg:gap-x-12">
                    <BlogShareSidebar blog={blog} views={views} />
                    <main className="flex-1 min-w-0 max-w-3xl mx-auto lg:max-w-none">
                        <article>
                            <BlogHeader blog={blog} />
                            <BlogTableOfContents headings={headings} />
                            <BlogContentRenderer content={blog.content} headings={headings} />
                            <hr className="my-12" />
                            <BlogAuthorBioSection author={author} />
                        </article>
                    </main>
                    <BlogSuggestedPosts author={author} suggestedBlogs={suggestedBlogs} />
                </div>
            </div>

            <ScrollToTopButton isVisible={isVisible} onClick={scrollToTop} />
        </>
    );
};

export default BlogPostClientWrapper;   