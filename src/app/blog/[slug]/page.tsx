import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import BlogPostClientWrapper from './components/BlogPostClientWrapper'; 
import { Blog, SuggestedBlog } from '@/types/helper.type';
import { unstable_cache } from 'next/cache';

export const revalidate = 86400;

type Props = {
    params: Promise<{ slug: string }>
}
const getCachedBlog = unstable_cache(
    async (slug: string) => {
        console.log(`*** Actually Fetching Blog for slug: ${slug} (via cache wrapper) ***`);
        return await api.blog.getBlog({ slug });
    },
    ['blog-by-slug'], 
    {
        tags: ['blog'], 
    }
);
export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;

    const blog = await getCachedBlog(slug);

    if (!blog) {
        return {
            title: 'Blog Post Not Found | BloAI Technology Blog',
            description: 'The blog post you are looking for could not be found.',
        };
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 
    const blogUrl = blog.canonicalUrl || `${appUrl}/blog/${blog.slug}`;

    const getTopKeywords = (tags: { name: string; relevance?: number }[], count = 5) => {
        if (!tags || tags.length === 0) {
            return 'AI, Technology, Machine Learning, Blog, Tutorial';
        }
        const sortedTags = [...tags].sort((a, b) => {
            if (a.relevance !== undefined && b.relevance !== undefined) {
                return b.relevance - a.relevance;
            }
            return a.name.localeCompare(b.name);
        });

        const filteredTags = sortedTags.filter(tag => {
            const lowerName = tag.name.toLowerCase();
            const genericTags = ['general', 'blog', 'article', 'post', 'tech', 'technology'];
            return !genericTags.includes(lowerName);
        });
        const prioritizedTags = filteredTags.sort((a, b) => b.name.length - a.name.length);
        const uniqueTagsMap = new Map<string, string>();
        prioritizedTags.forEach(tag => {
             if (!uniqueTagsMap.has(tag.name.toLowerCase())) {
                 uniqueTagsMap.set(tag.name.toLowerCase(), tag.name);
             }
         });
        const uniqueTags = Array.from(uniqueTagsMap.values()).slice(0, count);


        if (uniqueTags.length < count) {
            const defaultTags = ['AI', 'Machine Learning', 'Technology', 'Tutorial', 'Guide'];
            const needed = count - uniqueTags.length;
            defaultTags.forEach(tag => {
                if (uniqueTags.length < count && !uniqueTagsMap.has(tag.toLowerCase())) {
                     uniqueTags.push(tag);
                     uniqueTagsMap.set(tag.toLowerCase(), tag); 
                 }
             });
        }
        return Array.from(new Set(uniqueTags.slice(0, count).map(tag => tag.trim()))).join(', ');
    };


    const keywords = getTopKeywords(blog.tags || [], 5); 
    
    // Fallbacks and truncations for SEO
    const maxTitleLength = 60;
    const truncatedTitle = blog.title.length > maxTitleLength 
        ? `${blog.title.substring(0, maxTitleLength - 3)}...` 
        : blog.title;
        
    const defaultDescription = `Đọc bài viết: ${blog.title}. Cập nhật kiến thức AI và công nghệ mới nhất trên Bloai Blog.`;
    const finalDescription = blog.metaDescription || defaultDescription;
    const finalOgTitle = blog.ogTitle || truncatedTitle;
    const finalOgDescription = blog.ogDescription || finalDescription;

    const blogPostSeo = {
        title: truncatedTitle,
        description: finalDescription,
        keywords: keywords,
        canonical: blogUrl,
        openGraph: {
            type: 'article' as const,
            title: finalOgTitle,
            description: finalOgDescription, 
            url: blogUrl,
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200, 
                height: 630,
                alt: finalOgTitle,
            }] : (blog.imageUrl ? [{
                url: blog.imageUrl,
                width: 1200, 
                height: 630,
                alt: blog.title,
            }] : []),
            article: {
                publishedTime: blog.publishDate instanceof Date ? blog.publishDate.toISOString() : undefined,
                modifiedTime: (blog.updatedAt instanceof Date ? blog.updatedAt.toISOString() : 
                              (blog.publishDate instanceof Date ? blog.publishDate.toISOString() : undefined)),
                authors: blog.author?.name ? [blog.author.name] : ['BloAI Team'],
                tags: blog.tags?.map((tag: { name: string }) => tag.name) ?? [], 
            },
        },
        twitter: {
            card: "summary_large_image",
            title: finalOgTitle,
            description: finalOgDescription,
            images: blog.ogImageUrl ? [blog.ogImageUrl] : (blog.imageUrl ? [blog.imageUrl] : []),
            site: "@Bloai_Team"
        },
    };

    return {
        title: blogPostSeo.title,
        description: blogPostSeo.description,
        keywords: blogPostSeo.keywords,
        alternates: {
            canonical: blogPostSeo.canonical,
            languages: {
                'vi-VN': blogPostSeo.canonical,
                'x-default': blogPostSeo.canonical,
            }
        },
        openGraph: blogPostSeo.openGraph,
        twitter: blogPostSeo.twitter,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params; 

    const [blog, suggestedBlogsResult] = await Promise.all([
        getCachedBlog(slug),
        api.blog.getSuggestedBlogs({ slug, limit: 6 }) 
    ]);
    if (!blog) {
        notFound();
    }

    const suggestedBlogs = suggestedBlogsResult ?? []; 

  
    return (
        <BlogPostClientWrapper
            blogData={blog as Blog} 
            suggestedBlogsData={suggestedBlogs as SuggestedBlog[]} 
        />
    );
}
