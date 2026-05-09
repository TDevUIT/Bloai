# Project SEO Architecture Documentation
## Bloai Blog - Technical SEO Analysis & Recommendations

**Generated:** May 7, 2026  
**Framework:** Next.js 15.0.7 (App Router)  
**Database:** PostgreSQL + Prisma ORM  
**Deployment:** Vercel (assumed)  
**Language:** Vietnamese (vi_VN)  
**Domain:** https://www.bloai.blog

---

## Executive Summary

Bloai Blog là một nền tảng blog về AI và công nghệ được xây dựng trên Next.js 15 với App Router, sử dụng Server-Side Rendering (SSR), Static Site Generation (SSG), và Incremental Static Regeneration (ISR). Project có foundation SEO vững chắc với metadata system hoàn chỉnh, structured data implementation, và performance optimization strategies.

### SEO Maturity Score: **7.5/10**

**Strengths:**
- ✅ Comprehensive metadata architecture với Open Graph & Twitter Cards
- ✅ Structured data (JSON-LD) implementation cho Article, Organization, WebSite
- ✅ Dynamic sitemap generation với canonical URLs
- ✅ Image optimization với next/image và Cloudinary CDN
- ✅ Semantic HTML structure với proper heading hierarchy
- ✅ Mobile-first responsive design
- ✅ Performance optimization (prefetch, lazy loading, caching)

**Critical Issues:**
- ⚠️ Missing hreflang tags (no international SEO)
- ✅ RSS feed implementation completed
- ✅ Breadcrumbs component implemented
- ⚠️ No pagination SEO (rel="next", rel="prev")
- ⚠️ Missing FAQ schema despite having FAQ page
- ⚠️ No video schema (if video content exists)

---

## 1. Overview

### 1.1 Project Architecture

**Tech Stack:**
- **Framework:** Next.js 15.0.7 (App Router)
- **React:** 18.3.1
- **Database:** PostgreSQL via Prisma
- **Authentication:** NextAuth.js 5.0.0-beta.25
- **API Layer:** tRPC 11.0.0-rc.446
- **Image CDN:** Cloudinary
- **Analytics:** Vercel Analytics, Google Analytics (G-CL7D21ZY78)
- **Styling:** Tailwind CSS 3.4.3
- **Markdown:** react-markdown with rehype-raw, remark-gfm

**File Structure:**
```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (about, contact, tags, etc.)
│   ├── (protected)/       # Protected routes (admin)
│   ├── blog/              # Blog listing & dynamic [slug] routes
│   ├── new-post/          # Post creation interface
│   ├── layout.tsx         # Root layout with global metadata
│   ├── sitemap.ts         # Dynamic sitemap generator
│   └── robots.ts          # Robots.txt generator
├── components/            # Reusable UI components
│   ├── blog/             # Blog-specific components
│   └── ui/               # shadcn/ui components
├── server/               # Backend logic
│   ├── api/routers/      # tRPC routers (blog.ts)
│   └── auth/             # Authentication config
├── lib/                  # Utility functions
│   ├── gemini.ts         # AI content generation (SEO metadata)
│   ├── cerebras.ts       # Alternative AI provider
│   └── action.ts         # Server actions for SEO generation
├── config/               # Configuration files
│   └── seo.ts            # Centralized SEO configuration
└── types/                # TypeScript type definitions
```

### 1.2 SEO Strategy

**Primary Goals:**
1. Rank for Vietnamese AI-related keywords
2. Establish authority in AI/ML education space
3. Drive organic traffic through long-form technical content
4. Optimize for Google Discover and featured snippets
5. Prepare for AI search engines (ChatGPT, Perplexity, Gemini)

**Target Keywords (from metadata):**
- "AI Việt Nam", "Trí tuệ nhân tạo"
- "ChatGPT", "Midjourney", "AI Generative"
- "Hướng dẫn AI", "Công nghệ AI"
- "Machine Learning", "Deep Learning"
- "Ứng dụng AI" (business, healthcare, education)

**Content Strategy:**
- Long-form technical articles (avg 8-15 min read time)
- Tutorial-based content with code examples
- AI tool reviews and comparisons
- Vietnamese-first content with technical English terms

---

## 2. Rendering & Indexing Strategy

### 2.1 Rendering Modes Analysis

**File:** `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`

#### Blog Listing Page (`/blog`)
```typescript
export const dynamic = 'force-dynamic';
```

**Rendering:** Server-Side Rendering (SSR) on every request  
**SEO Impact:** ⚠️ **Medium Risk**

**Analysis:**
- Forces dynamic rendering for every request
- Ensures fresh content but sacrifices performance
- No static optimization benefits
- Increases TTFB (Time To First Byte)

**Why This Matters:**
- Googlebot prefers fast-loading pages
- Dynamic rendering can delay indexing if server response is slow
- No CDN caching benefits
- Higher server costs

**Recommendation:**
```typescript
// BETTER APPROACH
export const revalidate = 300; // ISR with 5-minute revalidation
// OR
export const dynamic = 'force-static'; // Full static generation
```

#### Blog Post Page (`/blog/[slug]`)
```typescript
const getCachedBlog = unstable_cache(
    async (slug: string) => {
        return await api.blog.getBlog({ slug });
    },
    ['blog-by-slug'], 
    {
        tags: ['blog'], 
    }
);
```

**Rendering:** Hybrid (SSG with on-demand revalidation)  
**SEO Impact:** ✅ **Excellent**

**Analysis:**
- Uses Next.js `unstable_cache` for data caching
- Static generation at build time
- On-demand revalidation via cache tags
- Fast TTFB for cached pages

**Crawlability Assessment:**
- ✅ Googlebot can easily crawl static HTML
- ✅ No JavaScript execution required for content
- ✅ Fast rendering improves crawl budget efficiency
- ✅ Proper HTTP caching headers

#### Homepage (`/`)
```typescript
export const dynamic = 'force-dynamic';

// Prefetch data for SSR hydration
void api.blog.getAllBlog.prefetch({ page: 1, limit: 9 });
void api.blog.getAllTags.prefetch({ page: 1, limit: 13 });
void api.blog.getLeaderBoard.prefetch({ blogLimit: 5, authorLimit: 5 });
```

**Rendering:** SSR with tRPC prefetching  
**SEO Impact:** ✅ **Good** (but could be better)

**Analysis:**
- Prefetching improves LCP (Largest Contentful Paint)
- Server-side data fetching ensures content in initial HTML
- `force-dynamic` prevents static optimization

**Recommendation:**
```typescript
// OPTIMAL APPROACH
export const revalidate = 60; // Revalidate every minute
// Remove force-dynamic to enable ISR
```

### 2.2 Rendering Strategy Comparison

| Page Type | Current Strategy | SEO Score | Performance | Recommendation |
|-----------|-----------------|-----------|-------------|----------------|
| Homepage | SSR (force-dynamic) | 7/10 | Medium | Switch to ISR (revalidate: 60) |
| Blog Listing | SSR (force-dynamic) | 6/10 | Medium | Switch to ISR (revalidate: 300) |
| Blog Post | SSG + Cache | 9/10 | Excellent | Keep current approach |
| Static Pages | SSG | 10/10 | Excellent | Perfect |

### 2.3 Hydration & JavaScript Impact

**Client Components Analysis:**

```typescript
// src/app/blog/[slug]/components/BlogPostClientWrapper.tsx
'use client';
```

**SEO Impact:** ✅ **Minimal Risk**

**Why It Works:**
- Content is server-rendered first (SSR)
- Client components only add interactivity
- Googlebot sees full HTML before hydration
- No content shift during hydration

**Critical Client Components:**
- `BlogPostClientWrapper` - Main blog container
- `BlogComment` - Comment system
- `BlogShareSidebar` - Social sharing
- `BlogGrid` - Blog listing with filters

**Best Practice Observed:**
- Content-heavy components are server components
- Interactive features are isolated in client components
- No "use client" at page level

### 2.4 Streaming & Suspense

**File:** `src/app/page.tsx`, `src/app/blog/page.tsx`

```typescript
<Suspense fallback={<Loading />}>
    <BlogGrid />
</Suspense>
```

**SEO Impact:** ✅ **Positive**

**Analysis:**
- Streaming allows progressive rendering
- Critical content loads first
- Improves perceived performance
- Googlebot waits for full stream completion

**Recommendation:**
- ✅ Current implementation is optimal
- Consider adding more granular Suspense boundaries for better UX

---

## 3. Metadata Architecture

### 3.1 Root Layout Metadata

**File:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    template: "%s | Bloai Blog"
  },
  description: "Bloai Blog - Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam...",
  keywords: [
    "AI Việt Nam", "Trí tuệ nhân tạo", "ChatGPT", "Midjourney",
    "AI Generative", "Công nghệ AI", "Hướng dẫn AI"
  ],
  metadataBase: new URL('https://www.bloai.blog'),
  openGraph: {
    title: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    description: "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
    url: "https://www.bloai.blog",
    siteName: "Bloai Blog",
    images: [{
      url: "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
      width: 1200,
      height: 630,
      alt: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ",
    }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloai Blog - Trí Tuệ Nhân Tạo & Công Nghệ Mới Nhất",
    description: "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
    images: ["https://www.bloai.blog/images/Logo/android-chrome-512x512.png"],
    site: "@bloaiblog",
    creator: "@bloaiblog",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};
```

**SEO Analysis:**

✅ **Strengths:**
- Comprehensive metadata coverage
- Proper title template for inheritance
- Open Graph fully implemented
- Twitter Card optimization
- Robots directives properly configured
- metadataBase set for absolute URL resolution

⚠️ **Issues:**
1. **Verification codes are placeholders** - Not configured
2. **Keywords meta tag** - Deprecated by Google (but useful for other search engines)
3. **Missing alternates** - No hreflang for international SEO
4. **Twitter handle** - "@bloaiblog" may not match actual account

**Recommendations:**
```typescript
// ADD:
alternates: {
  canonical: 'https://www.bloai.blog',
  languages: {
    'vi-VN': 'https://www.bloai.blog',
    'en-US': 'https://en.bloai.blog', // If English version exists
  },
},
// REMOVE keywords (deprecated)
// UPDATE verification codes with real values
```

### 3.2 Dynamic Blog Post Metadata

**File:** `src/app/blog/[slug]/page.tsx`

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

    // Keyword extraction logic
    const getTopKeywords = (tags, count = 5) => {
        // Filters generic tags, prioritizes specific ones
        // Sorts by relevance and length
    };

    const keywords = getTopKeywords(blog.tags || [], 5);
    
    // Title truncation for SEO
    const maxTitleLength = 60;
    const truncatedTitle = blog.title.length > maxTitleLength 
        ? `${blog.title.substring(0, maxTitleLength - 3)}...` 
        : blog.title;

    return {
        title: truncatedTitle,
        description: blog.metaDescription || defaultDescription,
        keywords: keywords,
        alternates: {
            canonical: blogUrl,
        },
        openGraph: {
            type: 'article',
            title: blog.ogTitle || truncatedTitle,
            description: blog.ogDescription || blog.metaDescription,
            url: blogUrl,
            images: blog.ogImageUrl ? [{
                url: blog.ogImageUrl,
                width: 1200,
                height: 630,
                alt: blog.ogTitle || blog.title,
            }] : [{
                url: blog.imageUrl,
                width: 1200,
                height: 630,
                alt: blog.title,
            }],
            article: {
                publishedTime: blog.publishDate.toISOString(),
                modifiedTime: blog.updatedAt.toISOString(),
                authors: [blog.author?.name || 'BloAI Team'],
                tags: blog.tags?.map(tag => tag.name) ?? [],
            },
        },
        twitter: {
            card: "summary_large_image",
            title: blog.ogTitle || truncatedTitle,
            description: blog.ogDescription || blog.metaDescription,
            images: [blog.ogImageUrl || blog.imageUrl],
            site: "@Bloai_Team"
        },
    };
}
```

**SEO Analysis:**

✅ **Excellent Practices:**
1. **Dynamic metadata generation** - Per-post customization
2. **Canonical URL handling** - Prevents duplicate content
3. **Title truncation** - Respects 60-character limit
4. **Fallback logic** - Handles missing data gracefully
5. **Open Graph Article** - Proper article metadata
6. **Keyword extraction** - Smart tag filtering
7. **Image optimization** - Proper dimensions (1200x630)

⚠️ **Issues:**
1. **404 metadata** - Could be more descriptive
2. **No author schema** - Missing author URL/profile
3. **Twitter handle inconsistency** - "@Bloai_Team" vs "@bloaiblog"
4. **Missing section/category** - No article:section in OG

**Recommendations:**
```typescript
// ADD to openGraph.article:
section: blog.tags[0]?.name || 'Technology',
expirationTime: undefined, // Articles don't expire

// ADD author profile:
authors: [{
    name: blog.author?.name,
    url: `${appUrl}/author/${blog.author?.id}`,
}],

// IMPROVE 404 metadata:
if (!blog) {
    return {
        title: 'Bài viết không tồn tại | Bloai Blog',
        description: 'Bài viết bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.',
        robots: { index: false, follow: true },
    };
}
```

### 3.3 Metadata Inheritance Flow

```
Root Layout (layout.tsx)
    ↓ (title template: "%s | Bloai Blog")
Blog Listing (/blog/page.tsx)
    ↓ (title: "Tất cả bài viết")
    → Final: "Tất cả bài viết | Bloai Blog"

Blog Post (/blog/[slug]/page.tsx)
    ↓ (title: "Dynamic Post Title")
    → Final: "Dynamic Post Title | Bloai Blog"
```

**SEO Impact:** ✅ **Optimal**

- Consistent branding across all pages
- Proper title hierarchy
- No title duplication

### 3.4 Database Schema for SEO Fields

**File:** `prisma/schema.prisma`

```prisma
model Blog {
    id               String     @id @default(cuid())
    title            String
    slug             String     @unique
    metaDescription  String     @db.VarChar(160)  // ✅ Enforced length
    content          String     @db.Text
    imageUrl         String
    imageAlt         String?                       // ✅ Alt text support
    canonicalUrl     String?                       // ✅ Custom canonical
    keywords         String[]                      // ✅ Keyword array
    ogTitle          String?                       // ✅ Custom OG title
    ogDescription    String?                       // ✅ Custom OG description
    ogImageUrl       String?                       // ✅ Custom OG image
    twitterCard      String?                       // ⚠️ Not used in code
    structuredData   Json?                         // ⚠️ Not populated
    featured         Boolean    @default(false)
    publishDate      DateTime   @default(now())
    updatedAt        DateTime   @updatedAt
    readTime         Int
    views            Int        @default(0)
    likes            Int        @default(0)
    
    @@index([slug])                                // ✅ Indexed for lookups
    @@index([publishDate])                         // ✅ Indexed for sorting
}
```

**SEO Analysis:**

✅ **Strengths:**
- Dedicated SEO fields in database
- Enforced metaDescription length (160 chars)
- Support for custom OG metadata
- Canonical URL flexibility
- Proper indexing on slug and publishDate

⚠️ **Unused Fields:**
- `twitterCard` - Defined but not used in metadata generation
- `structuredData` - JSON field exists but not populated

**Recommendations:**
1. **Use `structuredData` field** - Store generated JSON-LD
2. **Remove `twitterCard`** - Redundant (always "summary_large_image")
3. **Add `focusKeyword`** - Primary SEO keyword per post
4. **Add `metaRobots`** - Per-post indexing control

---

## 4. URL Structure Analysis

### 4.1 URL Patterns

**Current URL Structure:**

```
Homepage:           https://www.bloai.blog/
Blog Listing:       https://www.bloai.blog/blog
Blog Post:          https://www.bloai.blog/blog/[slug]
Tags:               https://www.bloai.blog/tags
Tag Filter:         https://www.bloai.blog/blog?tag=machine-learning
Pagination:         https://www.bloai.blog/blog?page=2
Search:             https://www.bloai.blog/search?q=chatgpt
About:              https://www.bloai.blog/about
Contact:            https://www.bloai.blog/contact
New Post:           https://www.bloai.blog/new-post
Admin:              https://www.bloai.blog/admin
```

**SEO Analysis:**

✅ **Strengths:**
- Clean, readable URLs
- No unnecessary parameters
- Proper slug generation (kebab-case)
- Logical hierarchy

⚠️ **Issues:**
1. **No category in URL** - `/blog/[slug]` instead of `/blog/[category]/[slug]`
2. **Query parameters for filtering** - `?tag=` instead of `/tags/[tag]`
3. **Pagination via query** - `?page=2` instead of `/blog/page/2`
4. **No date-based URLs** - Missing `/blog/2026/05/[slug]` option

**Impact on SEO:**
- ⚠️ Flat URL structure limits topical authority
- ⚠️ Query parameters are less SEO-friendly than path segments
- ⚠️ Pagination URLs don't signal content depth

### 4.2 Slug Generation

**File:** `src/types/helper.type.ts`

```typescript
export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Spaces to hyphens
    .replace(/[^\w-]+/g, '')        // Remove special chars
    .replace(/--+/g, '-')           // Multiple hyphens to single
    .replace(/^-+/, '')             // Remove leading hyphens
    .replace(/-+$/, '');            // Remove trailing hyphens
};
```

**SEO Analysis:**

✅ **Excellent Implementation:**
- Converts to lowercase (URL consistency)
- Replaces spaces with hyphens (readability)
- Removes special characters (compatibility)
- Handles Vietnamese characters properly
- Prevents double hyphens

**Example Transformations:**
```
"Hướng Dẫn ChatGPT 2024" → "huong-dan-chatgpt-2024"
"AI & Machine Learning" → "ai-machine-learning"
"React.js Tips & Tricks!" → "reactjs-tips-tricks"
```

**Recommendation:**
- ✅ Current implementation is optimal
- Consider adding transliteration for Vietnamese diacritics

### 4.3 Canonical URL Strategy

**File:** `src/app/blog/[slug]/page.tsx`

```typescript
const blogUrl = blog.canonicalUrl || `${appUrl}/blog/${blog.slug}`;

return {
    alternates: {
        canonical: blogUrl,
    },
};
```

**Database Support:**
```prisma
canonicalUrl     String?  // Optional custom canonical
```

**SEO Analysis:**

✅ **Strengths:**
- Supports custom canonical URLs
- Fallback to default URL structure
- Prevents duplicate content issues
- Allows cross-domain canonicalization

**Use Cases:**
1. **Syndicated content** - Point to original source
2. **URL migration** - Maintain old URL as canonical
3. **Parameter variations** - Consolidate tracking URLs

**Recommendation:**
```typescript
// ADD validation in tRPC router
canonicalUrl: z.string().url().optional().refine(
    (url) => !url || url.startsWith('https://'),
    { message: 'Canonical URL must use HTTPS' }
),
```

### 4.4 URL Structure Recommendations

**Current:**
```
/blog/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion
```

**Recommended (Option 1 - Category-based):**
```
/blog/ai-tools/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion
/blog/tutorials/huong-dan-chatgpt-cho-nguoi-moi-bat-dau
/blog/news/openai-ra-mat-gpt-5
```

**Recommended (Option 2 - Date-based):**
```
/blog/2026/05/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion
```

**Recommended (Option 3 - Hybrid):**
```
/ai-tools/xay-dung-ai-assistant-bi-mat-tao-tro-ly-thong-minh-tu-notion
/tutorials/huong-dan-chatgpt-cho-nguoi-moi-bat-dau
```

**Implementation:**
```typescript
// src/app/blog/[category]/[slug]/page.tsx
export async function generateStaticParams() {
    const blogs = await db.blog.findMany({
        select: { slug: true, category: true }
    });
    return blogs.map(blog => ({
        category: blog.category,
        slug: blog.slug
    }));
}
```

---


## 5. Semantic HTML & Accessibility

### 5.1 Heading Hierarchy Analysis

**File:** `src/app/blog/[slug]/components/BlogHeader.tsx`

```typescript
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 leading-[1.1] tracking-tight uppercase">
    {blog.title}
</h1>
```

**SEO Analysis:**

✅ **Strengths:**
- Single H1 per page (blog title)
- Proper semantic structure
- Responsive typography
- Clear visual hierarchy

**Heading Structure Across Pages:**

**Homepage (`/`):**
```html
<h1>Tin mới nhất</h1>  <!-- Main heading -->
```

**Blog Post (`/blog/[slug]`):**
```html
<h1>{blog.title}</h1>  <!-- Article title -->
<h2>Bình luận</h2>      <!-- Comments section -->
<h2>Bài viết liên quan</h2>  <!-- Related posts -->
<h3>{author.name}</h3>  <!-- Author name -->
```

**Blog Listing (`/blog`):**
```html
<h1>Tất cả bài viết</h1>
```

**SEO Score:** ✅ **9/10**

⚠️ **Minor Issues:**
1. Author name uses H3 - should be `<p>` with `<strong>`
2. No H2 for main content sections in blog posts
3. Missing skip-to-content link for accessibility

### 5.2 Semantic HTML Elements

**Navigation:**
```typescript
// src/components/Navbar.tsx
<header className="bg-white w-full sticky top-0 z-50">
    <nav aria-label="Category navigation">
        <Link href="/">Trang chủ</Link>
        <Link href="/tags">Danh Mục</Link>
        <Link href="/about">Về chúng tôi</Link>
    </nav>
</header>
```

✅ **Proper Usage:**
- `<header>` for site header
- `<nav>` with `aria-label`
- `<main>` for primary content
- `<footer>` for site footer
- `<article>` for blog posts
- `<section>` for content sections

**Article Structure:**
```typescript
// src/app/blog/[slug]/components/BlogPostClientWrapper.tsx
<main id="main-content" aria-label="Nội dung chính">
    <article>
        <BlogHeader blog={blog} />
        <BlogContentRenderer content={blog.content} />
        <BlogAuthorBioSection author={blog.author} />
        <BlogSuggestedPosts suggestedBlogs={suggestedBlogs} />
        <BlogComments slug={blog.slug} />
    </article>
</main>
```

✅ **Excellent Semantic Structure:**
- Proper `<article>` wrapper
- Logical content flow
- Clear section boundaries

### 5.3 ARIA Labels & Accessibility

**Search Component:**
```typescript
// src/components/Search.tsx
<input
    type="text"
    placeholder="Tìm kiếm bài viết..."
    aria-label="Tìm kiếm bài viết"
    className="w-full bg-white text-black border-[1.5px] border-black"
/>
```

**Navigation:**
```typescript
<button
    aria-label="User menu"
    aria-haspopup="true"
    aria-expanded={isOpen}
>
```

✅ **Accessibility Features:**
- ARIA labels on interactive elements
- Proper button semantics
- Focus management
- Keyboard navigation support

⚠️ **Missing:**
- Skip navigation link
- Focus visible styles
- Screen reader announcements for dynamic content
- Alt text validation (some images missing alt)

### 5.4 Content Hierarchy for Crawlers

**Markdown Rendering:**
```typescript
// src/app/blog/[slug]/components/BlogContentRenderer.tsx
<div className="prose prose-slate max-w-none lg:prose-lg 
    prose-headings:scroll-mt-40 
    prose-headings:font-extrabold 
    prose-headings:text-black">
    <DynamicReactMarkdown
        components={{
            h1: (props) => <CustomHeadingRenderer level={1} {...props} />,
            h2: (props) => <CustomHeadingRenderer level={2} {...props} />,
            h3: (props) => <CustomHeadingRenderer level={3} {...props} />,
        }}
    >
        {content}
    </DynamicReactMarkdown>
</div>
```

✅ **SEO-Friendly Markdown:**
- Proper heading hierarchy (H1 → H2 → H3)
- ID generation for anchor links
- Table of contents support
- Semantic HTML output

**Heading ID Generation:**
```typescript
const CustomHeadingRenderer = ({ level, children }) => {
    const text = getNodeText(children);
    const matchedHeading = headings.find(h => h.text === text && h.level === level);
    const finalId = matchedHeading?.id;
    
    const Tag = `h${level}`;
    return <Tag id={finalId}>{children}</Tag>;
};
```

✅ **Benefits:**
- Enables deep linking
- Supports table of contents
- Improves user navigation
- Helps search engines understand structure

### 5.5 Accessibility SEO Impact

**Why Accessibility Matters for SEO:**

1. **Screen Reader Optimization = Bot Optimization**
   - Clear structure helps both users and crawlers
   - Proper ARIA labels improve context understanding
   - Semantic HTML signals content importance

2. **Keyboard Navigation = Crawlability**
   - Logical tab order = logical content flow
   - Focus management = content hierarchy

3. **Alt Text = Image SEO**
   - Descriptive alt text helps image search
   - Missing alt text = missed ranking opportunity

**Current Accessibility Score:** 7.5/10

**Recommendations:**
```typescript
// ADD skip navigation
<a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to main content
</a>

// IMPROVE alt text validation
const validateAltText = (alt: string) => {
    if (!alt) return 'Missing alt text';
    if (alt.length < 10) return 'Alt text too short';
    if (alt.length > 125) return 'Alt text too long';
    return null;
};

// ADD focus visible styles
.focus-visible:focus {
    outline: 2px solid #000;
    outline-offset: 2px;
}
```

---

## 6. Structured Data Analysis

### 6.1 JSON-LD Implementation

**Root Layout Schema:**
**File:** `src/app/layout.tsx`

```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "description": "Trang tin tức hàng đầu về Trí Tuệ Nhân Tạo (AI) tại Việt Nam",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.bloai.blog/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Bloai Blog",
  "url": "https://www.bloai.blog",
  "logo": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
  "sameAs": [
    "https://www.facebook.com/bloaiblog",
    "https://twitter.com/bloaiblog",
    "https://www.linkedin.com/company/bloaiblog",
    "https://www.youtube.com/@bloaiblog"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84-xxx-xxx-xxxx",
    "contactType": "customer service",
    "areaServed": "VN",
    "availableLanguage": "Vietnamese"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Trang Chủ",
    "item": "https://www.bloai.blog"
  }]
};
```

**SEO Analysis:**

✅ **Strengths:**
- WebSite schema with SearchAction
- Organization schema with social profiles
- Breadcrumb schema (basic)
- Proper @context and @type

⚠️ **Issues:**
1. **Placeholder phone number** - "+84-xxx-xxx-xxxx"
2. **Static breadcrumb** - Only homepage, not dynamic
3. **Missing founder info** - Organization incomplete
4. **No address** - Missing physical location

### 6.2 Blog Post Article Schema

**File:** `src/app/blog/[slug]/components/BlogMetadata.tsx`

```typescript
const mainEntity = {
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
    },
    "headline": blog.title,
    "image": blog.imageUrl ? [blog.imageUrl] : [],
    "datePublished": new Date(blog.publishDate).toISOString(),
    "dateModified": blog.updatedAt 
        ? new Date(blog.updatedAt).toISOString() 
        : new Date(blog.publishDate).toISOString(),
    "description": blog.metaDescription,
    "author": {
        "@type": "Person",
        "name": blog.author.name,
        ...(blog.author.socials?.twitter && { 
            "sameAs": `https://twitter.com/${blog.author.socials.twitter}` 
        })
    },
    "publisher": {
        "@type": "Organization",
        "name": "Bloai",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.bloai.blog/images/Logo/android-chrome-512x512.png",
            "width": 600,
            "height": 400
        }
    },
    "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".blog-title", ".blog-meta-description"]
    }
};
```

**SEO Analysis:**

✅ **Excellent Implementation:**
- Complete Article schema
- Author with social profile
- Publisher information
- Speakable specification (voice search optimization!)
- Proper date formatting
- Image array support

⚠️ **Missing Fields:**
1. **wordCount** - Helps Google understand content depth
2. **articleBody** - Full text for better understanding
3. **keywords** - Article keywords
4. **articleSection** - Category/topic
5. **inLanguage** - "vi-VN"
6. **isAccessibleForFree** - true/false
7. **commentCount** - Number of comments

**Recommended Enhancement:**
```typescript
const mainEntity = {
    // ... existing fields
    "wordCount": blog.content.split(/\s+/).length,
    "articleBody": blog.content.substring(0, 5000), // First 5000 chars
    "keywords": blog.tags.map(t => t.name).join(', '),
    "articleSection": blog.tags[0]?.name || 'Technology',
    "inLanguage": "vi-VN",
    "isAccessibleForFree": true,
    "commentCount": blog.comments.length,
    "interactionStatistic": [{
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/CommentAction",
        "userInteractionCount": blog.comments.length
    }, {
        "@type": "InteractionCounter",
        "interactionType": "https://schema.org/ViewAction",
        "userInteractionCount": blog.views
    }]
};
```

### 6.3 Suggested Posts Schema

```typescript
const suggestedItems = (suggestedBlogs || []).map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "url": `${env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
    "image": post.imageUrl ? [post.imageUrl] : [],
    "datePublished": post.publishDate 
        ? new Date(post.publishDate).toISOString() 
        : undefined,
    "author": post.author?.name ? {
        "@type": "Person",
        "name": post.author.name
    } : undefined,
    "description": post.metaDescription
}));

return {
    "@context": "https://schema.org",
    "@graph": [mainEntity, ...suggestedItems]
};
```

**SEO Analysis:**

✅ **Innovative Approach:**
- Uses @graph to combine multiple entities
- Provides context for related content
- Helps Google understand content relationships

⚠️ **Potential Issue:**
- Large @graph can bloat HTML
- Consider limiting to 3-5 suggested posts

### 6.4 Missing Schema Types

**Recommended Additions:**

#### 1. FAQ Schema (for FAQ page)
```typescript
// src/app/(public)/faqs/page.tsx
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
        "@type": "Question",
        "name": "Bloai Blog là gì?",
        "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bloai Blog là nền tảng chia sẻ kiến thức về AI..."
        }
    }]
};
```

#### 2. BreadcrumbList (dynamic)
```typescript
// For blog posts
const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Trang chủ",
            "item": "https://www.bloai.blog"
        },
        {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://www.bloai.blog/blog"
        },
        {
            "@type": "ListItem",
            "position": 3,
            "name": blog.title,
            "item": `https://www.bloai.blog/blog/${blog.slug}`
        }
    ]
};
```

#### 3. Person Schema (for authors)
```typescript
const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "image": author.image,
    "description": author.bio,
    "sameAs": [
        author.socials?.twitter && `https://twitter.com/${author.socials.twitter}`,
        author.socials?.linkedin && `https://linkedin.com/in/${author.socials.linkedin}`
    ].filter(Boolean),
    "jobTitle": "AI Content Creator",
    "worksFor": {
        "@type": "Organization",
        "name": "Bloai Blog"
    }
};
```

#### 4. CollectionPage Schema (for blog listing)
```typescript
// src/app/blog/page.tsx
const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Tất cả bài viết về AI",
    "description": "Danh sách tất cả các bài viết về trí tuệ nhân tạo",
    "url": "https://www.bloai.blog/blog",
    "mainEntity": {
        "@type": "ItemList",
        "itemListElement": blogs.map((blog, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://www.bloai.blog/blog/${blog.slug}`
        }))
    }
};
```

### 6.5 Schema Validation

**Tools to Use:**
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Structured Data Linter: http://linter.structured-data.org/

**Current Validation Status:**
- ✅ WebSite schema: Valid
- ✅ Organization schema: Valid (but incomplete)
- ✅ Article schema: Valid
- ⚠️ Breadcrumb schema: Valid but static
- ❌ FAQ schema: Not implemented
- ❌ Person schema: Not implemented

**Rich Results Eligibility:**
- ✅ Article rich results: **Eligible**
- ⚠️ Breadcrumb rich results: **Partially eligible**
- ❌ FAQ rich results: **Not eligible** (no schema)
- ❌ Author rich results: **Not eligible** (incomplete schema)

---

## 7. Internal Linking Architecture

### 7.1 Navigation Structure

**Primary Navigation:**
**File:** `src/components/Navbar.tsx`

```typescript
<nav aria-label="Category navigation">
    <Link href="/">Trang chủ</Link>
    <Link href="/tags">Danh Mục</Link>
    <Link href="/about">Về chúng tôi</Link>
</nav>
```

**SEO Analysis:**

✅ **Strengths:**
- Clean, simple navigation
- Proper semantic HTML
- ARIA labels
- Consistent across pages

⚠️ **Issues:**
- Only 3 main links (limited topical coverage)
- No "Blog" link (users must go to homepage)
- No footer sitemap
- Missing breadcrumbs

**Link Equity Distribution:**
- Homepage: High (linked from every page)
- Tags page: Medium (in main nav)
- About page: Medium (in main nav)
- Blog posts: Low (only from homepage/listing)

### 7.2 Contextual Linking

**Blog Post Internal Links:**

1. **Related Posts:**
```typescript
// src/app/blog/[slug]/components/BlogSuggestedPosts.tsx
<Link href={`/blog/${post.slug}`}>
    <h3>{post.title}</h3>
</Link>
```

2. **Tag Links:**
```typescript
// src/app/blog/[slug]/components/BlogHeader.tsx
<Link href="/tags">
    <div className="px-3 py-1 text-xs">
        #{tag.name.toUpperCase()}
    </div>
</Link>
```

⚠️ **Issue:** Tag links go to `/tags` page, not `/tags/[tag]`

3. **Author Links:**
```typescript
// Currently no author profile pages
// Author name is not linked
```

❌ **Missing:** Author profile pages

### 7.3 Suggested Posts Algorithm

**File:** `src/server/api/routers/blog.ts`

```typescript
getSuggestedBlogs: publicProcedure
    .input(z.object({
        slug: z.string(),
        limit: z.number().int().positive().optional().default(3)
    }))
    .query(async ({ ctx, input }) => {
        const currentBlog = await ctx.db.blog.findUnique({
            where: { slug: input.slug },
            select: { tags: { select: { id: true } } }
        });

        const currentTagIds = currentBlog.tags.map(tag => tag.id);

        // SQL query to find posts with overlapping tags
        const suggestedBlogs = await ctx.db.$queryRaw`
            SELECT b."slug", b."title", b."imageUrl", ...
            FROM "Blog" b
            LEFT JOIN "_BlogToTag" bt_overlap 
                ON b."id" = bt_overlap."A" 
                AND bt_overlap."B" IN (${Prisma.join(currentTagIds)})
            WHERE b."slug" != ${input.slug}
            GROUP BY b."id", a."id"
            ORDER BY 
                COUNT(bt_overlap."B") DESC,  -- Most tag overlap
                b."publishDate" DESC          -- Then by recency
            LIMIT ${input.limit};
        `;

        return suggestedBlogs;
    });
```

**SEO Analysis:**

✅ **Excellent Algorithm:**
- Tag-based relevance (semantic similarity)
- Fallback to recent posts
- Efficient SQL query
- Configurable limit

**Internal Linking Benefits:**
- Keeps users on site (reduces bounce rate)
- Distributes link equity to related content
- Helps Google understand topic clusters
- Improves crawl depth

### 7.4 Breadcrumb Implementation

**Current Status:** ❌ **Not Implemented**

**Recommendation:**
```typescript
// src/components/Breadcrumbs.tsx
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center gap-2">
                        {index > 0 && <span>/</span>}
                        {index === items.length - 1 ? (
                            <span className="font-bold">{item.label}</span>
                        ) : (
                            <Link href={item.href} className="hover:underline">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

// Usage in blog post:
<Breadcrumbs items={[
    { label: 'Trang chủ', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: blog.tags[0]?.name || 'AI', href: `/tags/${blog.tags[0]?.name}` },
    { label: blog.title, href: `/blog/${blog.slug}` }
]} />
```

### 7.5 Footer Sitemap

**File:** `src/components/Footer.tsx`

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2">
    <div>
        <h3>Liên kết</h3>
        <ul>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/tags">Danh mục</Link></li>
            <li><Link href="/about">Về chúng tôi</Link></li>
        </ul>
    </div>
    <div>
        <h3>Thông tin</h3>
        <ul>
            <li><Link href="/faqs">FAQs</Link></li>
            <li><Link href="/privacy">Điều khoản & Bảo mật</Link></li>
        </ul>
    </div>
</div>
```

**SEO Analysis:**

✅ **Good Structure:**
- Organized by category
- Semantic HTML
- All major pages linked

⚠️ **Missing:**
- No "Popular Posts" section
- No "Recent Posts" section
- No tag cloud
- No category links

**Recommendation:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Existing sections */}
    
    {/* ADD: Popular Posts */}
    <div>
        <h3>Bài viết phổ biến</h3>
        <ul>
            {topPosts.map(post => (
                <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
    
    {/* ADD: Categories */}
    <div>
        <h3>Chủ đề</h3>
        <ul>
            {topTags.map(tag => (
                <li key={tag.name}>
                    <Link href={`/tags/${tag.name}`}>
                        {tag.name} ({tag.count})
                    </Link>
                </li>
            ))}
        </ul>
    </div>
</div>
```

### 7.6 Link Equity Flow Analysis

**Current Link Flow:**

```
Homepage (Authority: 100%)
    ↓ (nav links)
    ├─→ Tags Page (15%)
    ├─→ About Page (15%)
    └─→ Blog Posts (70% distributed)
        ↓ (suggested posts)
        └─→ Related Posts (link equity passed)
```

**Issues:**
1. **No category pages** - Link equity not organized by topic
2. **Flat structure** - All posts at same level
3. **No author pages** - Missing author authority building
4. **Limited cross-linking** - Posts only link via "suggested"

**Optimal Link Flow:**

```
Homepage
    ↓
    ├─→ Category Pages (AI Tools, Tutorials, News)
    │   ↓
    │   └─→ Blog Posts (organized by category)
    │       ↓
    │       ├─→ Related Posts (same category)
    │       ├─→ Author Page
    │       └─→ Tag Pages
    │
    ├─→ Author Pages
    │   ↓
    │   └─→ Author's Posts
    │
    └─→ Tag Pages
        ↓
        └─→ Tagged Posts
```

### 7.7 Orphan Page Detection

**Potential Orphan Pages:**
- `/new-post` - Only accessible when logged in
- `/admin` - Protected route
- Individual tag pages (if implemented)

**Recommendation:**
- Add XML sitemap inclusion for all public pages
- Implement "Browse by Tag" section on homepage
- Add "All Authors" page

---


## 8. Sitemap & Robots Strategy

### 8.1 Dynamic Sitemap Generation

**File:** `src/app/sitemap.ts`

```typescript
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
        throw new Error("Missing NEXT_PUBLIC_SITE_URL environment variable");
    }

    const [blogs] = await Promise.all([
        db.blog.findMany({
            select: {
                slug: true,
                updatedAt: true,
                featured: true,
                canonicalUrl: true,
            },
            orderBy: { updatedAt: 'desc' },
        })
    ]);

    const blogEntries = blogs.map(blog => {
        const url = blog.canonicalUrl || `${baseUrl}/blog/${blog.slug}`;
        return {
            url,
            lastModified: blog.updatedAt || new Date(),
            priority: 0.8,
            changeFrequency: 'weekly' as const,
        };
    });

    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/landing`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/tags`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    return [...staticUrls, ...blogEntries];
}
```

**SEO Analysis:**

✅ **Strengths:**
- Dynamic generation from database
- Respects custom canonical URLs
- Proper priority values
- Change frequency hints
- Last modified dates

⚠️ **Issues:**
1. **Missing `/blog` page** - Blog listing not in sitemap
2. **No tag pages** - Individual tag URLs missing
3. **No pagination** - `/blog?page=2` not included
4. **Featured posts** - Not prioritized differently
5. **No image sitemap** - Missing image URLs
6. **No news sitemap** - Could benefit from news-specific sitemap

**Priority Analysis:**

| URL | Priority | Justification | Recommendation |
|-----|----------|---------------|----------------|
| Homepage | 1.0 | ✅ Correct | Keep |
| Landing | 0.9 | ⚠️ Too high | Lower to 0.7 |
| About | 0.8 | ✅ Correct | Keep |
| Tags | 0.7 | ✅ Correct | Keep |
| Contact | 0.5 | ✅ Correct | Keep |
| Blog Posts | 0.8 | ⚠️ Too uniform | Vary by recency/views |

**Recommended Priority Logic:**
```typescript
const blogEntries = blogs.map(blog => {
    // Calculate dynamic priority
    const daysSincePublish = Math.floor(
        (Date.now() - new Date(blog.publishDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    let priority = 0.8;
    
    // Boost recent posts
    if (daysSincePublish < 7) priority = 0.9;
    else if (daysSincePublish < 30) priority = 0.85;
    else if (daysSincePublish > 365) priority = 0.6;
    
    // Boost featured posts
    if (blog.featured) priority = Math.min(priority + 0.1, 1.0);
    
    // Boost high-traffic posts
    if (blog.views > 1000) priority = Math.min(priority + 0.05, 1.0);
    
    return {
        url: blog.canonicalUrl || `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.updatedAt || new Date(),
        priority,
        changeFrequency: daysSincePublish < 30 ? 'daily' : 'weekly',
    };
});
```

### 8.2 Robots.txt Configuration

**File:** `src/app/robots.ts`

```typescript
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  if (!baseUrl) {
    console.warn("NEXT_PUBLIC_SITE_URL is not defined");
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
    };
  }
  
  return {
    rules: [
      {
        userAgent: '*', 
        allow: '/', 
        disallow: [
            '/api/', 
            '/new-post/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

**SEO Analysis:**

✅ **Strengths:**
- Blocks API routes (correct)
- Blocks post creation page (correct)
- Links to sitemap
- Allows all other pages

⚠️ **Issues:**
1. **Missing `/admin` block** - Admin panel should be disallowed
2. **No crawl-delay** - Could add for aggressive bots
3. **No specific bot rules** - Could optimize for different bots
4. **Missing auth routes** - `/auth/signin`, `/auth/signup` should be blocked

**Recommended Configuration:**
```typescript
return {
    rules: [
        {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/new-post/',
                '/admin/',
                '/auth/',
                '/*?*utm_*',  // Block tracking parameters
                '/*?*fbclid=*',
                '/*?*gclid=*',
            ],
        },
        {
            userAgent: 'GPTBot',  // OpenAI crawler
            allow: '/',
            disallow: ['/api/', '/admin/', '/auth/'],
        },
        {
            userAgent: 'Google-Extended',  // Google AI training
            allow: '/',  // Or disallow if you don't want AI training
        },
        {
            userAgent: 'CCBot',  // Common Crawl
            allow: '/',
        },
        {
            userAgent: 'anthropic-ai',  // Claude crawler
            allow: '/',
        },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,  // Preferred domain
};
```

### 8.3 Noindex/Nofollow Strategy

**Current Implementation:**

```typescript
// Root layout - All pages indexed by default
robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
    },
},
```

**SEO Analysis:**

✅ **Strengths:**
- Allows indexing by default
- Enables rich snippets (max-snippet: -1)
- Allows image indexing
- Allows video previews

⚠️ **Missing:**
- No per-page noindex control
- No pagination noindex strategy
- No tag page indexing strategy

**Recommended Per-Page Control:**

```typescript
// For 404 pages
export const metadata = {
    robots: { index: false, follow: true },
};

// For paginated pages (page 2+)
export async function generateMetadata({ searchParams }) {
    const page = searchParams.page || 1;
    
    return {
        robots: {
            index: page === 1,  // Only index first page
            follow: true,
        },
    };
}

// For low-quality tag pages
export async function generateMetadata({ params }) {
    const tag = await getTag(params.slug);
    
    return {
        robots: {
            index: tag.postCount >= 3,  // Only index tags with 3+ posts
            follow: true,
        },
    };
}
```

### 8.4 Crawl Budget Optimization

**Current Database Queries:**

```typescript
// Sitemap generation
const blogs = await db.blog.findMany({
    select: {
        slug: true,
        updatedAt: true,
        featured: true,
        canonicalUrl: true,
    },
    orderBy: { updatedAt: 'desc' },
});
```

**SEO Impact:** ✅ **Efficient**

- Minimal data fetched
- Indexed fields used for sorting
- No unnecessary joins

**Crawl Budget Considerations:**

1. **Sitemap Size:**
   - Current: ~5 static pages + N blog posts
   - Recommended: Split into multiple sitemaps if > 50,000 URLs

2. **Update Frequency:**
   - Blog posts: Updated on publish/edit
   - Static pages: Rarely change
   - Recommendation: Separate sitemaps

**Recommended Sitemap Structure:**

```typescript
// src/app/sitemap.xml/route.ts
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${baseUrl}/sitemap-static.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/sitemap-posts.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/sitemap-tags.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
    </sitemapindex>`;
    
    return new Response(sitemapIndex, {
        headers: { 'Content-Type': 'application/xml' },
    });
}
```

### 8.5 XML Sitemap Best Practices

**Current vs. Recommended:**

| Feature | Current | Recommended | Priority |
|---------|---------|-------------|----------|
| Dynamic generation | ✅ Yes | ✅ Keep | High |
| Last modified | ✅ Yes | ✅ Keep | High |
| Priority values | ✅ Yes | ⚠️ Make dynamic | Medium |
| Change frequency | ✅ Yes | ⚠️ Make accurate | Medium |
| Image sitemap | ❌ No | ✅ Add | High |
| News sitemap | ❌ No | ✅ Add | Medium |
| Video sitemap | ❌ No | ⚠️ If applicable | Low |
| Sitemap index | ❌ No | ✅ Add | Medium |
| Gzip compression | ❌ No | ✅ Add | Low |

**Image Sitemap Implementation:**

```typescript
// src/app/sitemap-images.xml/route.ts
export async function GET() {
    const blogs = await db.blog.findMany({
        select: {
            slug: true,
            title: true,
            imageUrl: true,
            imageAlt: true,
        },
    });
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${blogs.map(blog => `
        <url>
            <loc>${baseUrl}/blog/${blog.slug}</loc>
            <image:image>
                <image:loc>${blog.imageUrl}</image:loc>
                <image:title>${escapeXml(blog.title)}</image:title>
                <image:caption>${escapeXml(blog.imageAlt || blog.title)}</image:caption>
            </image:image>
        </url>
        `).join('')}
    </urlset>`;
    
    return new Response(xml, {
        headers: { 'Content-Type': 'application/xml' },
    });
}
```

---

## 9. Performance & Core Web Vitals

### 9.1 Current Performance Setup

**Next.js Configuration:**
**File:** `next.config.js`

```javascript
const config = {
  images: {
    domains: [
      'picsum.photos',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'media.discordapp.net',
      'images.unsplash.com',
      'imgur.com',
      'i.imgur.com',
      'miro.medium.com',
      'placeholder.com'
    ],
  },
};
```

**SEO Analysis:**

✅ **Strengths:**
- next/image optimization enabled
- Multiple CDN domains allowed
- Cloudinary integration

⚠️ **Issues:**
- No image size configuration
- No custom loader
- No format optimization specified
- Too many external domains (security risk)

### 9.2 Image Optimization Strategy

**Current Implementation:**

```typescript
// Using next/image
<Image
    src={blog.imageUrl}
    alt={blog.imageAlt || blog.title}
    width={1200}
    height={630}
    className="w-full h-full object-cover"
    loading="lazy"
    priority={false}
/>

// Using Cloudinary CldImage
<CldImage
    width={600}
    height={400}
    src={result.imageUrl}
    alt={result.imageAlt || result.title}
    loading="lazy"
    sizes="(max-width: 768px) 100vw, 600px"
    crop="fill"
    gravity="auto"
    quality={80}
/>
```

**SEO Analysis:**

✅ **Excellent Practices:**
- Lazy loading for below-fold images
- Responsive sizes attribute
- Cloudinary auto-optimization
- Proper alt text
- Quality control (80%)

⚠️ **Improvements Needed:**
1. **Priority images** - Hero images should have `priority={true}`
2. **Placeholder** - Add blur placeholder for better UX
3. **Format** - Explicitly request WebP/AVIF
4. **Srcset** - Ensure proper srcset generation

**Recommended Enhancement:**

```typescript
// For above-the-fold images
<CldImage
    width={1200}
    height={630}
    src={blog.imageUrl}
    alt={blog.imageAlt || blog.title}
    priority={true}  // ✅ No lazy loading
    placeholder="blur"  // ✅ Blur placeholder
    blurDataURL={blog.blurDataUrl}  // ✅ Pre-generated blur
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
    format="auto"  // ✅ Auto WebP/AVIF
    quality="auto"  // ✅ Auto quality
    crop="fill"
    gravity="auto"
    fetchPriority="high"  // ✅ Browser hint
/>

// For below-the-fold images
<CldImage
    width={600}
    height={400}
    src={post.imageUrl}
    alt={post.imageAlt || post.title}
    loading="lazy"
    placeholder="blur"
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    format="auto"
    quality="auto"
    crop="fill"
    gravity="auto"
    fetchPriority="low"  // ✅ Deprioritize
/>
```

### 9.3 Code Splitting & Lazy Loading

**Current Implementation:**

```typescript
// Dynamic import for markdown renderer
const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        loading: () => <div className='prose'><p>Loading content...</p></div>,
        ssr: false  // ⚠️ Client-side only
    }
);
```

**SEO Analysis:**

⚠️ **Critical Issue:**
- `ssr: false` means markdown content is NOT server-rendered
- Googlebot may not see content immediately
- Impacts indexing and ranking

**Recommendation:**

```typescript
// BETTER: Server-side rendering
const DynamicReactMarkdown = dynamic(
    () => import('react-markdown').then(mod => mod.default),
    {
        loading: () => <div className='prose'><p>Loading...</p></div>,
        ssr: true,  // ✅ Server-side rendering
    }
);

// OR: Use static import (best for SEO)
import ReactMarkdown from 'react-markdown';
```

**Other Dynamic Imports:**

```typescript
// Check for unnecessary dynamic imports
// These should be static for SEO-critical components
import { BlogHeader } from './BlogHeader';  // ✅ Static
import { BlogContent } from './BlogContent';  // ✅ Static
import { BlogComments } from './BlogComments';  // ✅ Can be dynamic (below fold)
```

### 9.4 Prefetching & Preloading

**Current Implementation:**

```typescript
// Homepage prefetching
void api.blog.getAllBlog.prefetch({ page: 1, limit: 9 });
void api.blog.getAllTags.prefetch({ page: 1, limit: 13 });
void api.blog.getLeaderBoard.prefetch({ blogLimit: 5, authorLimit: 5 });

// Suggested posts prefetching
{suggestedBlogs?.map(post => (
    <link key={`prefetch-${post.slug}`} rel="prefetch" href={`/blog/${post.slug}`} as="document" />
))}
```

**SEO Analysis:**

✅ **Excellent Practices:**
- tRPC prefetching for SSR
- Link prefetching for suggested posts
- Improves LCP and FCP

**Additional Recommendations:**

```typescript
// Preconnect to external domains
<link rel="preconnect" href="https://res.cloudinary.com" />
<link rel="dns-prefetch" href="https://res.cloudinary.com" />

// Preload critical fonts
<link
    rel="preload"
    href="/fonts/inter-var.woff2"
    as="font"
    type="font/woff2"
    crossOrigin="anonymous"
/>

// Preload critical CSS
<link rel="preload" href="/styles/critical.css" as="style" />

// Prefetch next page in pagination
{currentPage < totalPages && (
    <link rel="prefetch" href={`/blog?page=${currentPage + 1}`} />
)}
```

### 9.5 Caching Strategy

**Current Implementation:**

```typescript
// Blog post caching
const getCachedBlog = unstable_cache(
    async (slug: string) => {
        return await api.blog.getBlog({ slug });
    },
    ['blog-by-slug'], 
    {
        tags: ['blog'], 
    }
);
```

**SEO Analysis:**

✅ **Strengths:**
- Next.js Data Cache
- Tag-based revalidation
- Efficient cache invalidation

**Cache Headers Analysis:**

```typescript
// Recommended cache headers
export const revalidate = 3600;  // 1 hour

export async function generateMetadata() {
    // Metadata is cached automatically
}
```

**Recommended Caching Strategy:**

| Resource | Cache Duration | Revalidation | Justification |
|----------|----------------|--------------|---------------|
| Homepage | 60s | ISR | Frequently updated |
| Blog Post | 1 hour | On-demand | Rarely changes after publish |
| Blog Listing | 5 min | ISR | New posts added regularly |
| Static Pages | 1 day | ISR | Rarely change |
| Images | 1 year | Immutable | Versioned URLs |
| API Routes | No cache | N/A | Dynamic data |

### 9.6 Font Loading Optimization

**Current Implementation:**

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});
```

**SEO Analysis:**

✅ **Excellent Implementation:**
- Next.js font optimization
- Vietnamese subset (reduces file size)
- Font-display: swap (prevents FOIT)
- CSS variable for flexibility

**Performance Impact:**
- ✅ Automatic font subsetting
- ✅ Self-hosted fonts (no external requests)
- ✅ Preloaded automatically
- ✅ No layout shift

### 9.7 Core Web Vitals Optimization

**LCP (Largest Contentful Paint) - Target: < 2.5s**

**Current Optimizations:**
- ✅ Image optimization with Cloudinary
- ✅ SSR for fast initial render
- ✅ Prefetching for data
- ⚠️ Large hero images may delay LCP

**Recommendations:**
```typescript
// Optimize hero image
<CldImage
    src={featuredPost.imageUrl}
    alt={featuredPost.title}
    width={1200}
    height={630}
    priority={true}  // ✅ High priority
    fetchPriority="high"  // ✅ Browser hint
    quality="auto:best"  // ✅ Best quality for hero
    format="auto"  // ✅ WebP/AVIF
/>
```

**CLS (Cumulative Layout Shift) - Target: < 0.1**

**Current Optimizations:**
- ✅ Fixed image dimensions
- ✅ Skeleton loaders
- ⚠️ Dynamic content may cause shifts

**Recommendations:**
```typescript
// Reserve space for dynamic content
<div className="min-h-[400px]">
    <Suspense fallback={<BlogCardSkeleton />}>
        <BlogGrid />
    </Suspense>
</div>

// Use aspect-ratio for images
<div className="aspect-[16/9]">
    <Image src={...} fill className="object-cover" />
</div>
```

**INP (Interaction to Next Paint) - Target: < 200ms**

**Current Optimizations:**
- ✅ Client components for interactivity
- ✅ Debounced search
- ⚠️ Large bundle size may impact INP

**Recommendations:**
```typescript
// Debounce expensive operations
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
    (value) => {
        performSearch(value);
    },
    300  // 300ms delay
);

// Use React.memo for expensive components
export const BlogCard = React.memo(({ blog }) => {
    // Component logic
});
```

### 9.8 Bundle Size Analysis

**Current Dependencies:**

```json
{
  "next": "15.0.7",
  "react": "18.3.1",
  "@tanstack/react-query": "5.50.0",
  "@trpc/client": "11.0.0-rc.446",
  "react-markdown": "10.1.0",
  "framer-motion": "12.6.3",  // ⚠️ Large library
  "recharts": "2.15.3",  // ⚠️ Large library
}
```

**Recommendations:**
1. **Analyze bundle** - Use `@next/bundle-analyzer`
2. **Tree shaking** - Ensure proper imports
3. **Dynamic imports** - For heavy libraries
4. **Remove unused deps** - Audit package.json

```bash
# Enable bundle analyzer
ANALYZE=true npm run build
```

---


## 10. Image SEO

### 10.1 Alt Text Strategy

**Database Schema:**
```prisma
model Blog {
    imageUrl         String
    imageAlt         String?    // ✅ Dedicated field
    ogImageUrl       String?
}
```

**Implementation:**
```typescript
// Blog post creation
imageAlt: z.string().max(125).optional(),

// Rendering
<CldImage
    src={blog.imageUrl}
    alt={blog.imageAlt || blog.title}  // ✅ Fallback to title
    width={1200}
    height={630}
/>
```

**SEO Analysis:**

✅ **Strengths:**
- Dedicated alt text field
- 125 character limit (optimal)
- Fallback to title
- Validation in tRPC schema

⚠️ **Issues:**
- Alt text is optional (should be required)
- No validation for quality
- No AI-generated alt text fallback
- No alt text for user avatars

**Alt Text Quality Check:**

```typescript
// Current: Basic fallback
alt={blog.imageAlt || blog.title}

// Recommended: Quality validation
const getOptimalAltText = (blog: Blog): string => {
    // Priority 1: Custom alt text
    if (blog.imageAlt && blog.imageAlt.length >= 10) {
        return blog.imageAlt;
    }
    
    // Priority 2: AI-generated alt text
    if (blog.aiGeneratedAlt) {
        return blog.aiGeneratedAlt;
    }
    
    // Priority 3: Descriptive fallback
    const category = blog.tags[0]?.name || 'technology';
    return `${blog.title} - ${category} article thumbnail`;
    
    // Avoid: Just title (not descriptive enough)
};
```

**Recommended Alt Text Guidelines:**

| Image Type | Alt Text Format | Example |
|------------|----------------|---------|
| Blog thumbnail | "[Topic] - [Key benefit/feature]" | "ChatGPT tutorial - Step-by-step guide for beginners" |
| Author avatar | "[Author name]'s profile picture" | "Nguyễn Văn A's profile picture" |
| Infographic | "Infographic showing [data/concept]" | "Infographic showing AI adoption rates in Vietnam 2024" |
| Screenshot | "Screenshot of [tool/interface]" | "Screenshot of Midjourney interface showing prompt settings" |
| Decorative | "" (empty alt) | "" |

### 10.2 Image File Naming

**Current Implementation:**
- Images uploaded to Cloudinary
- Cloudinary generates random IDs
- Original filename lost

**SEO Impact:** ⚠️ **Negative**

**Recommendation:**

```typescript
// Before upload, rename file
const generateSEOFilename = (blog: Blog, originalName: string): string => {
    const slug = blog.slug;
    const extension = originalName.split('.').pop();
    const timestamp = Date.now();
    
    return `${slug}-thumbnail-${timestamp}.${extension}`;
    // Example: "chatgpt-tutorial-thumbnail-1714521600000.jpg"
};

// Cloudinary upload with custom public_id
const uploadResult = await cloudinary.uploader.upload(file, {
    public_id: generateSEOFilename(blog, file.name),
    folder: 'blog-thumbnails',
    resource_type: 'image',
});
```

### 10.3 Responsive Images

**Current Implementation:**

```typescript
<CldImage
    width={600}
    height={400}
    src={post.imageUrl}
    alt={post.imageAlt || post.title}
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    loading="lazy"
/>
```

**SEO Analysis:**

✅ **Excellent:**
- Proper sizes attribute
- Responsive breakpoints
- Lazy loading
- Cloudinary auto-optimization

**Generated srcset (Cloudinary):**
```html
<img
    srcset="
        https://res.cloudinary.com/.../w_640/image.jpg 640w,
        https://res.cloudinary.com/.../w_750/image.jpg 750w,
        https://res.cloudinary.com/.../w_828/image.jpg 828w,
        https://res.cloudinary.com/.../w_1080/image.jpg 1080w,
        https://res.cloudinary.com/.../w_1200/image.jpg 1200w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

✅ **Benefits:**
- Browser selects optimal size
- Reduces bandwidth
- Improves LCP
- Better mobile performance

### 10.4 Image Format Optimization

**Cloudinary Auto-Format:**

```typescript
<CldImage
    src={blog.imageUrl}
    format="auto"  // ✅ Auto WebP/AVIF
    quality="auto"  // ✅ Auto quality
/>
```

**Format Priority:**
1. AVIF (best compression, modern browsers)
2. WebP (good compression, wide support)
3. JPEG (fallback)

**SEO Impact:** ✅ **Positive**
- Faster loading = better rankings
- Reduced bandwidth = better UX
- Modern formats = better Core Web Vitals

### 10.5 Image Lazy Loading Strategy

**Current Implementation:**

```typescript
// Above-the-fold (hero image)
<CldImage
    src={featuredPost.imageUrl}
    priority={true}  // ✅ No lazy loading
    loading="eager"
/>

// Below-the-fold (blog cards)
<CldImage
    src={post.imageUrl}
    loading="lazy"  // ✅ Lazy loading
    fetchPriority="low"
/>
```

**SEO Analysis:**

✅ **Optimal Strategy:**
- Hero images load immediately
- Below-fold images lazy load
- Proper priority hints

**Lazy Loading Threshold:**

```typescript
// Recommended: First 3 blog cards eager, rest lazy
{blogs.map((blog, index) => (
    <BlogCard
        key={blog.id}
        blog={blog}
        priority={index < 3}  // ✅ First 3 eager
    />
))}
```

### 10.6 Image CDN Configuration

**Current Setup:**
- Cloudinary CDN
- Auto-optimization enabled
- Multiple transformations

**Cloudinary Transformations:**

```typescript
<CldImage
    src={blog.imageUrl}
    width={1200}
    height={630}
    crop="fill"           // ✅ Crop to exact dimensions
    gravity="auto"        // ✅ Smart cropping (face detection)
    quality="auto"        // ✅ Auto quality
    format="auto"         // ✅ Auto format
    dpr="auto"            // ✅ Auto DPR (Retina displays)
    fetchFormat="auto"    // ✅ Auto format negotiation
/>
```

**SEO Benefits:**
- ✅ Automatic optimization
- ✅ Smart cropping (preserves important content)
- ✅ Format negotiation (serves best format)
- ✅ DPR handling (Retina displays)
- ✅ Global CDN (fast delivery)

### 10.7 Image Sitemap

**Current Status:** ❌ **Not Implemented**

**Recommendation:**

```typescript
// src/app/sitemap-images.xml/route.ts
export async function GET() {
    const blogs = await db.blog.findMany({
        select: {
            slug: true,
            title: true,
            imageUrl: true,
            imageAlt: true,
            publishDate: true,
        },
    });
    
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
        ${blogs.map(blog => `
        <url>
            <loc>https://www.bloai.blog/blog/${blog.slug}</loc>
            <image:image>
                <image:loc>${blog.imageUrl}</image:loc>
                <image:title>${escapeXml(blog.title)}</image:title>
                <image:caption>${escapeXml(blog.imageAlt || blog.title)}</image:caption>
                <image:geo_location>Vietnam</image:geo_location>
                <image:license>https://www.bloai.blog/license</image:license>
            </image:image>
        </url>
        `).join('')}
    </urlset>`;
    
    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
```

**Benefits:**
- Helps Google discover images
- Improves image search rankings
- Provides context for images
- Enables rich image results

---

## 11. Mobile SEO

### 11.1 Responsive Design

**Current Implementation:**

```typescript
// Tailwind responsive classes
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
    {blog.title}
</h1>

// Mobile-first approach
<div className="px-4 min-[375px]:px-6 md:px-8">
    {/* Content */}
</div>
```

**SEO Analysis:**

✅ **Excellent Mobile-First Design:**
- Tailwind mobile-first breakpoints
- Responsive typography
- Flexible layouts
- Touch-friendly UI

**Breakpoints:**
```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### 11.2 Viewport Configuration

**File:** `src/app/layout.tsx`

```typescript
// Implicit viewport (Next.js default)
// <meta name="viewport" content="width=device-width, initial-scale=1" />
```

**SEO Analysis:**

✅ **Correct Configuration:**
- width=device-width (responsive)
- initial-scale=1 (no zoom)
- No maximum-scale (accessibility)

**Recommendation:**
```typescript
// Explicit viewport configuration
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,  // Allow zoom for accessibility
    userScalable: true,
    themeColor: '#ffffff',
};
```

### 11.3 Touch Target Sizes

**Current Implementation:**

```typescript
// Navigation links
<Link
    href="/"
    className="px-4 py-1.5 text-[10px] md:text-xs"
>
    Đăng Nhập
</Link>

// Buttons
<button className="w-8 h-8 border border-black">
    <FaSearch className="w-3.5 h-3.5" />
</button>
```

**SEO Analysis:**

⚠️ **Touch Target Issues:**
- 32px × 32px minimum (Google recommendation)
- Current: 32px × 24px (height too small)

**Recommendation:**

```typescript
// Minimum 44px × 44px (Apple guideline)
// Minimum 48px × 48px (Material Design)
<button className="min-w-[44px] min-h-[44px] flex items-center justify-center">
    <FaSearch className="w-4 h-4" />
</button>

// Add padding for smaller visual elements
<Link
    href="/"
    className="px-4 py-3 text-sm"  // ✅ Larger touch area
>
    Đăng Nhập
</Link>
```

### 11.4 Mobile Performance

**Current Optimizations:**

```typescript
// Conditional rendering for mobile
const isMobile = useIsMobile();

{!isMobile ? (
    <div className="w-56">
        <Search />
    </div>
) : (
    <Link href="/search">
        <FaSearch />
    </Link>
)}
```

**SEO Analysis:**

✅ **Smart Mobile Optimization:**
- Simplified mobile UI
- Reduced JavaScript execution
- Faster rendering

**Mobile-Specific Optimizations:**

```typescript
// Lazy load mobile-specific components
const MobileMenu = dynamic(() => import('./MobileMenu'), {
    ssr: false,
    loading: () => <div>Loading...</div>,
});

// Reduce image quality on mobile
<CldImage
    src={blog.imageUrl}
    quality={isMobile ? 70 : 80}  // ✅ Lower quality on mobile
    width={isMobile ? 640 : 1200}
/>
```

### 11.5 Mobile-First Indexing

**Google's Mobile-First Index:**
- Google primarily uses mobile version for indexing
- Desktop version is secondary

**Current Status:** ✅ **Mobile-First Ready**

**Checklist:**
- ✅ Responsive design
- ✅ Same content on mobile and desktop
- ✅ Structured data on mobile
- ✅ Metadata on mobile
- ✅ Images optimized for mobile
- ✅ Fast mobile loading

**Verification:**

```bash
# Test mobile rendering
curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
    https://www.bloai.blog/blog/[slug]

# Check mobile-friendliness
# Google Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
```

### 11.6 Mobile UX for SEO

**Current Implementation:**

```typescript
// Sticky header
<header className="sticky top-0 z-50">
    <Navbar />
</header>

// Smooth scrolling
<html className="scroll-smooth">
```

**SEO Benefits:**
- ✅ Easy navigation (sticky header)
- ✅ Smooth scrolling (better UX)
- ✅ Touch-friendly (large tap targets)

**Recommendations:**

```typescript
// Add "Back to Top" button
<BackToTop />  // ✅ Already implemented

// Add mobile-specific navigation
<MobileNav />  // ⚠️ Consider adding

// Optimize form inputs for mobile
<input
    type="email"
    inputMode="email"  // ✅ Mobile keyboard optimization
    autoComplete="email"
/>

<input
    type="tel"
    inputMode="tel"  // ✅ Number keyboard
    autoComplete="tel"
/>
```

---

## 12. International SEO

### 12.1 Current Language Setup

**Primary Language:** Vietnamese (vi_VN)

**File:** `src/app/layout.tsx`

```typescript
<html lang="vi" className="antialiased">
```

**Metadata:**

```typescript
openGraph: {
    locale: "vi_VN",
},
```

**SEO Analysis:**

✅ **Correct Language Declaration:**
- HTML lang attribute
- Open Graph locale
- Vietnamese font subset

⚠️ **Missing:**
- No hreflang tags
- No alternate language versions
- No language switcher

### 12.2 Hreflang Implementation

**Current Status:** ❌ **Not Implemented**

**Recommendation:**

```typescript
// If English version exists
export const metadata = {
    alternates: {
        canonical: 'https://www.bloai.blog',
        languages: {
            'vi-VN': 'https://www.bloai.blog',
            'en-US': 'https://en.bloai.blog',
            'x-default': 'https://www.bloai.blog',  // Default for unmatched languages
        },
    },
};

// In HTML head
<link rel="alternate" hreflang="vi-VN" href="https://www.bloai.blog" />
<link rel="alternate" hreflang="en-US" href="https://en.bloai.blog" />
<link rel="alternate" hreflang="x-default" href="https://www.bloai.blog" />
```

**For Blog Posts:**

```typescript
export async function generateMetadata({ params }) {
    const blog = await getBlog(params.slug);
    
    return {
        alternates: {
            canonical: `https://www.bloai.blog/blog/${blog.slug}`,
            languages: {
                'vi-VN': `https://www.bloai.blog/blog/${blog.slug}`,
                'en-US': blog.englishSlug 
                    ? `https://en.bloai.blog/blog/${blog.englishSlug}`
                    : undefined,
            },
        },
    };
}
```

### 12.3 Content Localization

**Current Content:**
- Vietnamese primary content
- English technical terms preserved
- Mixed language approach

**SEO Impact:** ✅ **Appropriate for Target Audience**

**Examples:**

```markdown
# Vietnamese with English terms
"Hướng dẫn sử dụng ChatGPT cho người mới bắt đầu"
"Tối ưu React Performance với useMemo và useCallback"
"Machine Learning cơ bản: Supervised vs Unsupervised Learning"
```

**Recommendation:**
- ✅ Keep current approach (Vietnamese + English technical terms)
- Consider adding English translations for international reach
- Use `lang` attribute for English sections

```html
<p>
    Trong bài viết này, chúng ta sẽ tìm hiểu về 
    <span lang="en">Machine Learning</span> và ứng dụng của nó.
</p>
```

### 12.4 Geo-Targeting

**Current Setup:**

```typescript
// Organization schema
"contactPoint": {
    "@type": "ContactPoint",
    "areaServed": "VN",  // ✅ Vietnam
    "availableLanguage": "Vietnamese"
}
```

**Google Search Console:**
- Set target country: Vietnam
- Set target language: Vietnamese

**Recommendation:**

```typescript
// Add geo-location to structured data
const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bloai Blog",
    "address": {
        "@type": "PostalAddress",
        "addressCountry": "VN",
        "addressLocality": "Ho Chi Minh City",  // If applicable
    },
    "areaServed": {
        "@type": "Country",
        "name": "Vietnam"
    },
};
```

### 12.5 Currency & Date Formatting

**Current Implementation:**

```typescript
// Date formatting
new Date(blog.publishDate).toLocaleDateString('vi-VN')
// Output: "07/05/2026"
```

**SEO Analysis:**

✅ **Correct Localization:**
- Vietnamese date format
- Proper locale usage

**Recommendation:**

```typescript
// More descriptive date format
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};
// Output: "7 tháng 5, 2026"

// Time formatting
const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
};
```

### 12.6 International Expansion Strategy

**If Expanding to English:**

1. **URL Structure:**
```
Option 1 - Subdomain:
https://www.bloai.blog (Vietnamese)
https://en.bloai.blog (English)

Option 2 - Subdirectory:
https://www.bloai.blog/vi/ (Vietnamese)
https://www.bloai.blog/en/ (English)

Option 3 - ccTLD:
https://www.bloai.vn (Vietnamese)
https://www.bloai.com (English)
```

2. **Database Schema:**
```prisma
model Blog {
    id               String
    slug             String
    language         String  @default("vi")  // ✅ Add language field
    translationOf    String?  // ✅ Link to original post
    translations     Blog[]   @relation("BlogTranslations")
}
```

3. **Language Switcher:**
```typescript
<LanguageSwitcher
    currentLang="vi"
    availableLanguages={[
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ]}
/>
```

---

