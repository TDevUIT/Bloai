import { BlogGrid } from "@/components/blog/BlogGrid";
import { blogPageMetadata, blogSchema, safeJsonLdStringify } from "@/config/seo";

export const metadata = blogPageMetadata

export default async function Page() {
  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(blogSchema) }}
      />
      <main className="min-h-screen">
        <div className="">
            <BlogGrid
            />
        </div>
      </main>
    </>

  );
}