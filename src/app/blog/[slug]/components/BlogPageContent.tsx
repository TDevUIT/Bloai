'use client';
import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Share, Eye as EyeIcon } from 'lucide-react';
import { FaArrowUp, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { env } from '@/env';
import { IconUserOff } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hook/use-mobile';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { CldImage } from 'next-cloudinary';
import Loading from '@/components/loading';
import { Label } from '@/components/ui/label';

const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        loading: () => <div className='prose max-w-none'><p>Loading content...</p></div>,
        ssr: false
    }
);


interface AuthorSocials {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
}

interface Author {
    id?: string | number;
    name?: string;
    image?: string;
    bio?: string;
    socials?: AuthorSocials;
}

interface Blog {
    slug: string;
    title: string;
    imageUrl?: string;
    imageAlt?: string;
    publishDate: string | Date;
    updatedAt?: string | Date;
    author: Author | null;
    metaDescription: string;
    canonicalUrl: string;
    tags: { name: string }[];
    content: string;
    readTime?: number;
}

interface SuggestedBlog {
    slug: string;
    title: string;
    imageUrl?: string;
    imageAlt?: string;
    publishDate: Date;
    readTime: number;
    metaDescription: string;
    author: {
      name?: string;
      image?: string;
    } | null;
    tags: { name: string }[];
}

interface BlogPageContentProps {
    blog: any | null | undefined;
    suggestedBlogs?: any[] | null | undefined;
}

interface AuthorCardProps {
    author: Author | null;
    className?: string;
    imageSize?: number;
    showSocials?: boolean;
}


const slugify = (text: string): string => {
    if (!text) return '';
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
};

const getNodeText = (node: any): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getNodeText).join('');
    if (typeof node === 'object' && node !== null && node.props?.children) {
      return getNodeText(node.props.children);
    }
    return '';
};


const AuthorCard: React.FC<AuthorCardProps> = ({
    author,
    className = '',
    imageSize = 96,
    showSocials = true,
}) => {
    if (!author) return null;

    const socialLinks = [
        { platform: 'Twitter', url: author.socials?.twitter, Icon: FaTwitter, label: "Author's Twitter Profile" },
        { platform: 'Facebook', url: author.socials?.facebook, Icon: FaFacebook, label: "Author's Facebook Profile" },
        { platform: 'LinkedIn', url: author.socials?.linkedin, Icon: FaLinkedin, label: "Author's LinkedIn Profile" },
    ].filter(link => link.url);

    return (
        <div className={`flex flex-col items-center text-center ${className}`}>
            <Image
                src={author.image || '/fallback-avatar.png'}
                alt={author.name ? `${author.name}'s Avatar` : 'Author Avatar'}
                width={imageSize}
                height={imageSize}
                className="rounded-full object-cover mb-4 border-4 border-white shadow-lg"
                priority={imageSize > 80}
                quality={80}
                unoptimized={!author.image || author.image.startsWith('/')}
            />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{author.name || 'Unknown Author'}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
                {author.bio || 'No bio available.'}
            </p>
            {showSocials && socialLinks.length > 0 && (
                 <div className="flex gap-3 w-full items-center justify-center">
                    <div className="flex gap-2">
                        {socialLinks.map(({ platform, url, Icon, label }) => (
                             <Link
                                key={platform}
                                href={url!}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                aria-label={label}
                                title={label}
                            >
                                <Icon className="w-5 h-5" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const BlogPostPageContent: React.FC<BlogPageContentProps> = ({
    blog,
    suggestedBlogs = []
}) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [views, setViews] = useState<number | null>(null);
    const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);
    const isMobile = useIsMobile();

    const extractedHeadings = useMemo(() => {
        if (!blog?.content || typeof blog.content !== 'string') {
            return [];
        }
    
        const headingRegex = /^(#{1,3})\s+(.+)/gm;
        const matches = Array.from(blog.content.matchAll(headingRegex) as IterableIterator<RegExpMatchArray>);
        const tempHeadings: { text: string; level: number; id: string }[] = [];
        const uniqueIds = new Set<string>();
    
        matches.forEach((match, index) => {
            const level = match[1]?.length ?? 1;
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

    const CustomHeadingRenderer = useCallback(
        ({
            level,
            children,
            ...props
        }: {
            level: 1 | 2 | 3;
            children?: React.ReactNode;
            [key: string]: any;
        }) => {
            const text = children ? getNodeText(children) : '';
            const matchedHeading = headings.find((h) => h.text === text && h.level === level);
            const finalId = matchedHeading?.id;

            const Tag = `h${level}` as keyof JSX.IntrinsicElements;

            if (!finalId) {
                return <Tag {...props}>{children || ''}</Tag>;
            }

            return (
                <Tag id={finalId} {...props} key={finalId}>
                {children || ''}
                </Tag>
            );
        },
        [headings]
    );


    const handleShare = useCallback(() => {
        if (navigator.clipboard && window.location.href) {
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Đã sao chép liên kết vào clipboard!'))
                .catch(err => console.error('Failed to copy link: ', err));
        } else {
            alert('Không thể sao chép liên kết trên trình duyệt này.');
        }
    }, []);

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

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const structuredData = useMemo(() => {
        if (!blog) return null;

        const publisherLogo = {
            "@type": "ImageObject",
            "url": `https://res.cloudinary.com/dq2z27agv/image/upload/v1742958723/aeaxx8zqeqvhosqew1ka.webp`,
            "width": 600,
            "height": 400
        };

        const mainEntity: any = {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": blog.canonicalUrl || window.location.href
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
            "name": "BloAI",
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

     const blogTagsMemo = useMemo(() => {
        if (!blog?.tags) return [];
        const tagsToShow = isMobile ? 3 : 5;
        return blog.tags.slice(0, tagsToShow).map((tag: { name: string }, index: number) => (
            <div
                key={`${tag.name}-${index}`}
                className="px-3 py-1 text-xs font-medium text-blue-600 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            >
                #{tag.name.toUpperCase()}
            </div>
        ));
     }, [blog?.tags, isMobile]);

     const remainingTagsCount = useMemo(() => {
        if (!blog?.tags) return 0;
        const tagsToShow = isMobile ? 3 : 5;
        return Math.max(0, blog.tags.length - tagsToShow);
     }, [blog?.tags, isMobile]);

    if (!blog) {
        return <Loading />;
    }

    if (!blog.author) {
         return (
             <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center p-6 bg-gray-50 rounded-lg shadow-xs border border-dashed border-amber-400 max-w-2xl mx-auto my-12">
                 <div className="inline-flex items-center gap-2 text-amber-600">
                     <IconUserOff stroke={1.5} className="w-10 h-10" />
                     <span className="text-2xl font-semibold">Author Information Unavailable</span>
                 </div>
                 <p className="max-w-md text-gray-700">
                     We couldn't load the author details for this post right now. The content is still available below.
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-x-8 lg:gap-x-12">

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
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blog.canonicalUrl)}&text=${encodeURIComponent(blog.title)}`}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        aria-label="Share on Twitter"
                                        title="Share on Twitter"
                                    >
                                        <FaTwitter className="w-5 h-5 text-gray-500 hover:text-[#1DA1F2]" />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blog.canonicalUrl)}`}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer nofollow"
                                        aria-label="Share on Facebook"
                                         title="Share on Facebook"
                                    >
                                        <FaFacebook className="w-5 h-5 text-gray-500 hover:text-[#1877F2]" />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blog.canonicalUrl)}`}
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

                    <main className="flex-1 min-w-0 max-w-3xl mx-auto lg:max-w-none">
                        <article>
                             <div className="mb-6">
                                <Link href="/" passHref legacyBehavior>
                                    <a className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
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

                            <div className="mb-10 p-2 border-2 md:block hidden">
                                <Label className="text-xl font-bold mb-4 text-orange-700 flex items-center gap-2 pb-2 border-b-2 border-orange-100">
                                    <span className="p-2 bg-orange-100 rounded-full">📦</span>
                                    Mục lục
                                </Label>
                                <nav aria-label="Table of contents ">
                                    <ul className="space-y-1.5 text-sm max-h-auto overflow-auto  scroll-custom pr-3">
                                        {headings.map((heading) => (
                                            <li 
                                                key={heading.id}
                                                className="relative transition-transform hover:translate-x-1"
                                            >
                                                <Link
                                                    href={`#${heading.id}`}
                                                    className={`
                                                        flex items-center text-gray-700 hover:text-orange-600 
                                                        transition-all duration-200 px-3 py-2 rounded-xl
                                                        focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                                                        ${heading.level === 1 ? 
                                                            'font-bold text-base bg-orange-100/50 hover:bg-orange-100' : 
                                                            'hover:bg-orange-50'
                                                        }
                                                        ${heading.level === 2 ? 'pl-6 text-sm border-l-4 border-orange-200' : ''}
                                                        ${heading.level === 3 ? 'pl-10 text-sm text-gray-600' : ''}
                                                    `}
                                                >
                                                    {heading.level > 1 && (
                                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-300 rounded-full" />
                                                    )}
                                                    
                                                    <DynamicReactMarkdown>
                                                        {heading.level === 3 ? `↳ ${heading.text}` : heading.text}
                                                    </DynamicReactMarkdown>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </div>


                            <div className="prose prose-slate max-w-none lg:prose-lg prose-headings:scroll-mt-24 prose-img:rounded-lg prose-img:shadow-md prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:transition-colors prose-a:duration-150 prose-code:before:content-none prose-code:after:content-none mb-12">
                                <DynamicReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: (props) => <CustomHeadingRenderer level={1} {...props} />,
                                        h2: (props) => <CustomHeadingRenderer level={2} {...props} />,
                                        h3: (props) => <CustomHeadingRenderer level={3} {...props} />,
                                    }}
                                >
                                    {blog.content}
                                </DynamicReactMarkdown>
                            </div>

                            <hr className="my-12 border-gray-200"/>

                            <div className='w-full flex items-center justify-center mb-12'>
                                <AuthorCard author={blog.author} imageSize={120} showSocials={true} />
                            </div>
                        </article>
                    </main>

                    <aside className="md:block w-72 shrink-0 hidden self-start">
                        <div className="sticky top-28 space-y-8">
                            <div className='bg-linear-to-br from-gray-800 to-black p-1 rounded-2xl shadow-lg relative'>
                                <div className="p-4 bg-white rounded-xl">
                                    <AuthorCard author={blog.author} imageSize={80} showSocials={false}/>
                                </div>
                                <div className='bg-black rounded-b-xl mt-0 py-2'>
                                <h2 className='text-white font-semibold text-lg text-center tracking-wide'>TÁC GIẢ</h2>
                                </div>
                            </div>

                            {(suggestedBlogs && suggestedBlogs.length > 0) && (
                                <div className='bg-white p-4 rounded-lg shadow-xs border border-gray-100'>
                                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Bài viết liên quan</h2>
                                    <div className='overflow-y-auto max-h-[calc(100vh-400px)] space-y-5 scroll-custom pr-2 -mr-2'>
                                        {suggestedBlogs.map((post) => (
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
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-2 md:bottom-8 md:right-8 z-50 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 ease-in-out transform hover:scale-110"
                    aria-label='Scroll to top'
                    title="Scroll back to top"
                >
                    <FaArrowUp className="w-5 h-5" />
                </button>
            )}
        </>
    );
}

export default BlogPostPageContent;