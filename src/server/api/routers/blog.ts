import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const blogRouter = createTRPCRouter({
    create: protectedProcedure
    .input(
        z.object({
          title: z.string().min(10).max(120),
          slug: z.string().regex(/^[a-z0-9-]+$/),
          content: z.string().min(50),
          tags: z.array(z.string()).max(15),
          thumbnail: z.string().url().optional(), 
          metaDescription: z.string().min(80).max(160),
          imageAlt: z.string().max(125).optional(),
          description: z.string().min(200).max(600),
          canonicalUrl: z.string().url().optional(),
          ogTitle: z.string().max(120).optional(),
          ogDescription: z.string().max(600).optional(),
          readTime: z.number().int().positive(),
        })
      )
       .mutation(async ({ ctx, input }) => {
            try {
                const existingBlog = await ctx.db.blog.findUnique({
                    where: { slug: input.slug },
                })
                if(existingBlog) {
                    throw new TRPCError({ code: "BAD_REQUEST", message: "Slug already exists" });
                }
    
                // const structuredData = {
                //     "@context": "https://schema.org",
                //     "@type": "BlogPosting",
                //     "headline": input.title,
                //     "description": input.metaDescription,
                //     "datePublished": new Date().toISOString(),
                //     "author": {
                //     "@type": "Person",
                //     "name": 
                //     }
                // }
                const result = await ctx.db.$transaction(async (prisma) => {
                    const tags = await Promise.all(
                        input.tags.map(async (tagName) => {
                          const normalizedTag = tagName.toLowerCase()
                          return await prisma.tag.upsert({
                            where: { name: normalizedTag },
                            create: { name: normalizedTag },
                            update: {}
                          })
                        })
                    )
    
                    const blog = await prisma.blog.create({
                        data: {
                            title: input.title,
                            slug: input.slug,
                            content: input.content,
                            metaDescription: input.metaDescription,
                            imageUrl: input.thumbnail as string,
                            imageAlt: input.imageAlt,
                            canonicalUrl: input.canonicalUrl,
                            ogTitle: input.ogTitle,
                            ogDescription: input.ogDescription,
                            //   ogImageUrl: input.ogImageUrl,
                            //   twitterCard: input.twitterCard,
                            //   featured: input.featured,
                            readTime: input.readTime,
                            keywords: input.tags,
                            //   structuredData: input.structuredData,
                            author: {
                                connect: { id: ctx.session.user.id }
                            },
                            tags: {
                                connect: tags.map((tag) => ({ id: tag.id }))
                            }
                        },
                            include: {
                                tags: true,
                                author: true
                            }
                      })
                      return blog
                    })
                return { success: true, result }
            } catch (err) {
                // if (input.thumbnail) {
                //     const publicId = extractPublicId(input.thumbnail)
                //     await cloudinary.v2.uploader.destroy(publicId)
                // }
            }
            
        }),
    
        getBlog: publicProcedure
            .input(z.object({ slug: z.string() }))
            .query(async ({ ctx, input }) => {
                const blog = await ctx.db.blog.findUnique({
                    where: { slug: input.slug },
                    include: {
                        tags: true,
                        author: true,
                    },
                });
                if (!blog) {
                    throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
                }
                return blog;
        }),

        getAllBlog: publicProcedure
            .input(z.object({
            page: z.number().int().positive().optional().default(1), 
            limit: z.number().int().positive().optional().default(6)
            }))
            .query(async ({ ctx, input }) => {
            const skip = (input.page - 1) * input.limit;
            
            const blogs = await ctx.db.blog.findMany({
                skip: skip,
                take: input.limit,
                orderBy: { publishDate: 'desc' },
                include: {
                tags: true,
                author: true,
                },
            });
            
            return blogs;
        }),
});
