import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
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
        });
        if (existingBlog) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Slug already exists" });
        }
        const result = await ctx.db.$transaction(async (prisma) => {
          const normalizedTags = input.tags.map(tag => tag.toLowerCase());
          const uniqueTags = [...new Set(normalizedTags)];
          const existingTags = await prisma.tag.findMany({
            where: { name: { in: uniqueTags } },
          });

          const existingTagNames = existingTags.map(t => t.name);
          const newTags = uniqueTags.filter(name => !existingTagNames.includes(name));

          if (newTags.length > 0) {
            await prisma.tag.createMany({
              data: newTags.map(name => ({ name })),
              skipDuplicates: true,
            });
          }

          const allTags = await prisma.tag.findMany({
            where: { name: { in: uniqueTags } },
          });

          return prisma.blog.create({
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
              readTime: input.readTime,
              keywords: input.tags,
              authorId: ctx.session.user.id,
              tags: {
                connect: allTags.map(tag => ({ id: tag.id })),
              },
            },
            include: {
              tags: true,
              author: true,
            },
          });
        }, {
          timeout: 10000, 
        });
        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create blog post",
        });
      }
    }),
    
    getBlog: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
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
            } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            console.error("Database error:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to fetch blog",
            });
            }
        }),

        getAllBlog: publicProcedure
        .input(z.object({
          page: z.number().int().positive().optional().default(1), 
          limit: z.number().int().positive().optional().default(6)
        }))
        .query(async ({ ctx, input }) => {
          const skip = (input.page - 1) * input.limit;
          const [blogs, totalBlogs] = await Promise.all([
            ctx.db.blog.findMany({
              skip,
              take: input.limit,
              orderBy: { publishDate: 'desc' },
              include: {
                tags: true,
                author: true,
              },
            }),
            ctx.db.blog.count() 
          ]);
      
          const totalPages = Math.ceil(totalBlogs / input.limit);
      
          return {
            blogs,
            total: totalBlogs,
            totalPages,
            currentPage: input.page,
            limit: input.limit
          };
        }),
    getAllTags: publicProcedure
      .input(z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(10)
      }))
      .query(async ({ ctx, input }) => {
        const skip = (input.page - 1) * input.limit;
        const tags = await ctx.db.tag.findMany({
          skip: skip,
          take: input.limit,
          include: {
            _count: {
              select: { blogs: true }
            }
          },
          orderBy: {
            blogs: {
              _count: 'desc'
            }
          }
        });
        
        const totalTags = await ctx.db.tag.count();
        
        return {
          tags,
          totalTags,
          totalPages: Math.ceil(totalTags / input.limit),
          currentPage: input.page
        };
    }),

    getSuggestedBlogs: publicProcedure
  .input(z.object({
    slug: z.string(),
    limit: z.number().int().positive().optional().default(3)
  }))
  .query(async ({ ctx, input }) => {
    try {
      const currentBlog = await ctx.db.blog.findUnique({
        where: { slug: input.slug },
        select: { tags: { select: { id: true } } }
      });

      if (!currentBlog) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Blog not found" });
      }

      const currentTagIds = currentBlog.tags.map(tag => tag.id);
      let suggestedBlogs;

      if (currentTagIds.length === 0) {
        suggestedBlogs = await ctx.db.blog.findMany({
          where: { slug: { not: input.slug } },
          take: input.limit,
          orderBy: { publishDate: 'desc' },
          select: { 
            slug: true,
            title: true,
            imageUrl: true,
            imageAlt: true,
            publishDate: true,
            readTime: true,
            metaDescription: true,
            author: { select: { name: true, image: true } },
            tags: { select: { name: true } }
          }
        });
      } else {
        suggestedBlogs = await ctx.db.$queryRaw`
        SELECT 
          b."slug",
          b."title",
          b."imageUrl",
          b."imageAlt",
          b."publishDate",
          b."readTime",
          b."metaDescription",
          json_build_object('name', a."name", 'image', a."image") as author,
          COALESCE(
            json_agg(json_build_object('name', t."name")) 
            FILTER (WHERE t."id" IS NOT NULL), 
            '[]'::json
          ) as tags
        FROM "Blog" b
        INNER JOIN "User" a ON b."authorId" = a."id" 
        LEFT JOIN "_BlogToTag" bt ON b."id" = bt."A"  
        LEFT JOIN "Tag" t ON bt."B" = t."id"         
        LEFT JOIN "_BlogToTag" bt_overlap 
          ON b."id" = bt_overlap."A" 
          AND bt_overlap."B" IN (${Prisma.join(currentTagIds)})  
        WHERE b."slug" != ${input.slug}
        GROUP BY b."id", a."id"
        ORDER BY 
          COUNT(bt_overlap."B") DESC, 
          b."publishDate" DESC
        LIMIT ${input.limit};
      `;
      }

      return suggestedBlogs;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Database error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch suggested blogs",
      });
    }
  }),
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const decodedSlug = decodeURIComponent(input.slug)
      const tag = await ctx.db.tag.findFirst({
        where: { name: decodedSlug },
        include: {
          blogs: {
            select: {
              id: true,
              title: true,
              slug: true,
              metaDescription: true,
              imageUrl: true,
              imageAlt: true,
              publishDate: true,
              readTime: true,
              author: true,
              tags: true,
            },
            orderBy: { publishDate: 'desc' },
          },
        },
      })

      if (!tag) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tag not found',
        })
      }

      return tag
    }),
});
