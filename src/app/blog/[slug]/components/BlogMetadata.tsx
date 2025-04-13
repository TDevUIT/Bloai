'use client';
import React, { useMemo } from 'react';
import { env } from '@/env';
import { BlogCore, SuggestedBlog } from '@/types/helper.type';

interface BlogMetadataProps {
    blog: BlogCore | null;
    suggestedBlogs?: SuggestedBlog[] | null;
}

const BlogMetadata: React.FC<BlogMetadataProps> = ({ blog, suggestedBlogs }) => {
    const structuredData = useMemo(() => {
        if (!blog) return null;

        const publisherLogo = {
            "@type": "ImageObject",
            "url": `https://res.cloudinary.com/dq2z27agv/image/upload/v1742958723/aeaxx8zqeqvhosqew1ka.webp`, 
            "width": 600,
            "height": 400
        };

        const blogUrl = blog.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

        const mainEntity: any = {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": blogUrl
            },
            "headline": blog.title,
            "image": blog.imageUrl ? [blog.imageUrl] : [],
            "datePublished": new Date(blog.publishDate).toISOString(),
            "dateModified": blog.updatedAt ? new Date(blog.updatedAt).toISOString() : new Date(blog.publishDate).toISOString(),
            "description": blog.metaDescription,
            "speakable": {
                "@type": "SpeakableSpecification",
                "cssSelector": [
                  ".blog-title",
                  ".blog-meta-description"
                ]
            }
        };

        if (blog.author) {
            mainEntity.author = {
                "@type": "Person",
                "name": blog.author.name,
                 ...(blog.author.socials?.twitter && { "sameAs": `https://twitter.com/${blog.author.socials.twitter}` })
            };
        }

        mainEntity.publisher = {
            "@type": "Organization",
            "name": "Bloai",
            "logo": publisherLogo
        };

        const suggestedItems = (suggestedBlogs || []).map((post) => ({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "url": `${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`, 
            "image": post.imageUrl ? [post.imageUrl] : [],
            "datePublished": post.publishDate ? new Date(post.publishDate).toISOString() : undefined,
            "author": post.author?.name ? {
                "@type": "Person",
                "name": post.author.name
            } : undefined,
            "description": post.metaDescription
        }));

        return {
            "@context": "https://schema.org",
            "@graph": [
                mainEntity,
                ...suggestedItems
            ]
        };
    }, [blog, suggestedBlogs]);

    if (!blog) return null;

    return (
        <>
            {structuredData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
            )}
            <link rel="preconnect" href="https://res.cloudinary.com" />
            {suggestedBlogs?.map(post => (
                <link key={`prefetch-${post.slug}`} rel="prefetch" href={`/blog/${post.slug}`} as="document" />
            ))}
        </>
    );
};

export default BlogMetadata;