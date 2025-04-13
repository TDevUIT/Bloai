import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/trpc/server';
import BlogPostClientWrapper from './components/BlogPostClientWrapper'; 
import { Blog, SuggestedBlog } from '@/types/helper.type';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;

    const blog = await api.blog.getBlog({ slug });

    if (!blog) {
        return {
            title: 'Blog Post Not Found | BloAI Technology Blog',
            description: 'The blog post you are looking for could not be found.',
        };
    }
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; 
    const blogUrl = blog.canonicalUrl || `${appUrl}/blog/${blog.slug}`;

    const blogPostSeo = {
        title: `${blog.title} | BloAI Technology Blog`,
        description: blog.metaDescription,
        canonical: blogUrl,
        openGraph: {
            type: 'article' as const,
            title: blog.ogTitle || blog.title,
            description: blog.ogDescription || blog.metaDescription || '', 
            url: blogUrl,
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200, 
                height: 630,
                alt: blog.ogTitle || blog.title,
            }] : (blog.imageUrl ? [{
                url: blog.imageUrl,
                width: 1200, 
                height: 630,
                alt: blog.title,
            }] : []),
            article: {
                publishedTime: blog.publishDate?.toISOString(),
                modifiedTime: blog.updatedAt?.toISOString() || blog.publishDate?.toISOString(),
                authors: blog.author?.name ? [blog.author.name] : ['BloAI Team'],
                tags: blog.tags?.map((tag: { name: string }) => tag.name) ?? [], 
            },
        },
        twitter: {
            card: "summary_large_image",
            title: blog.ogTitle || blog.title,
            description: blog.ogDescription || blog.metaDescription || '',
            images: blog.ogImageUrl ? [blog.ogImageUrl] : (blog.imageUrl ? [blog.imageUrl] : []),
            site: "@Bloai_Team"
        },
    };

    return {
        title: blogPostSeo.title,
        description: blogPostSeo.description,
        alternates: {
            canonical: blogPostSeo.canonical,
        },
        openGraph: blogPostSeo.openGraph,
        twitter: blogPostSeo.twitter,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params; 

    const [blog, suggestedBlogsResult] = await Promise.all([
        api.blog.getBlog({ slug }),
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
