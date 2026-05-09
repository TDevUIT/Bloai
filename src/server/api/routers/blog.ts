import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";
import { Resend } from "resend";
import { sendBlogNotifications, sendConfirmationEmail } from "@/lib/notifySubscribers";
import { revalidateTag } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

export const blogRouter = createTRPCRouter({
  unsubscribeToNewsletter: publicProcedure
  .input(z.object({ email: z.string().email() }))
  .mutation(async ({ ctx, input }) => {
    try {
      const existingSubscriber = await ctx.db.newsletterSubscription.findUnique({
        where: { email: input.email },
      });

      if (!existingSubscriber) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Email not found in our subscription list",
        });
      }

      if (!existingSubscriber.active) {
        return { success: true, message: "Email was already unsubscribed" };
      }

      await ctx.db.newsletterSubscription.update({
        where: {
          email: input.email,
        },
        data: {
          active: false,
          unsubscribedAt: new Date(), 
        },
      });
      
      return { success: true };
    } catch (error) {
      console.error("Unsubscription error:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to unsubscribe from newsletter",
        cause: error,
      });
    }
  }),
  subscribeToNewsletter: publicProcedure
  .input(z.object({ email: z.string().email(), name: z.string().optional() }))
  .mutation(async ({ ctx, input }) => {
    try {
      const existingSubscriber = await ctx.db.newsletterSubscription.findUnique({
        where: { email: input.email },
      });

      if (existingSubscriber) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already subscribed",
        });
      }

      const subscription = await ctx.db.newsletterSubscription.create({
        data: {
          email: input.email,
          subscribedAt: new Date(),
          active: true,
        },
      });

      try {
        await sendConfirmationEmail({ email: input.email });
        console.log(`Successfully sent confirmation email to ${input.email}`);
      } catch (emailError) {
        console.error(`Failed to send confirmation email to ${input.email}:`, emailError);
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe?email=${encodeURIComponent(input.email)}`;
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'newsletter@bloai.blog',
          to: input.email,
          subject: 'Chào mừng bạn đến với Bloai!',
          text: `Cảm ơn bạn đã đăng ký nhận tin từ Bloai! Chúng tôi sẽ gửi cho bạn những bài viết mới nhất về công nghệ và AI.\n\nĐội ngũ Bloai\n\nHủy đăng ký: ${unsubscribeUrl}`,
        });
        console.log(`Sent fallback text confirmation email to ${input.email}`);
      }

      return { success: true, subscription };
    } catch (error) {
      console.error("Subscription error:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to newsletter",
        cause: error
      });
    }
  }),
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
        // description: z.string().min(200).max(600),
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
        if (result) {
          setImmediate(async () => {
            try {
              await sendBlogNotifications({
                db: ctx.db,
                blogId: result.id,
                type: "new",
              });
            } catch (emailError) {
              console.error("Failed to send blog notifications:", emailError);
            }
          });
        }

        revalidateTag("blog");

        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create blog post",
        });
      }
    }),
    update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(10).max(120),
        slug: z.string().regex(/^[a-z0-9-]+$/),
        content: z.string().min(50),
        tags: z.array(z.string()).max(15),
        thumbnail: z.string().url().optional(),
        metaDescription: z.string().min(80).max(160),
        imageAlt: z.string().max(125).optional(),
        // description: z.string().min(200).max(600),
        canonicalUrl: z.string().url().optional(),
        ogTitle: z.string().max(120).optional(),
        ogDescription: z.string().max(600).optional(),
        readTime: z.number().int().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const existingBlog = await ctx.db.blog.findFirst({
          where: {
            slug: input.slug,
            id: { not: input.id }
          }
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

          await prisma.blog.update({
            where: { id: input.id },
            data: {
              tags: {
                set: []
              }
            }
          });

          return prisma.blog.update({
            where: { id: input.id },
            data: {
              title: input.title,
              slug: input.slug,
              content: input.content,
              metaDescription: input.metaDescription,
              imageUrl: input.thumbnail,
              imageAlt: input.imageAlt,
              canonicalUrl: input.canonicalUrl,
              ogTitle: input.ogTitle,
              ogDescription: input.ogDescription,
              readTime: input.readTime,
              keywords: input.tags,
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

        revalidateTag("blog");

        return { success: true, result };
      } catch (err) {
        console.error(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update blog post",
        });
      }
    }),
    getBlog: publicProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx, input }) => {
            try {
            const blog = await ctx.db.blog.findUnique({
                where: { slug: input.slug },
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  content: true,
                  imageUrl: true,
                  imageAlt: true,
                  publishDate: true,
                  updatedAt: true,
                  readTime: true,
                  canonicalUrl: true,
                  metaDescription: true,
                  ogTitle: true,
                  ogDescription: true,
                  ogImageUrl: true,
                  authorId: true,
                  tags: { select: { id: true, name: true } },
                  author: { select: { id: true, name: true, image: true } },
                  comments: {
                    select: {
                      id: true,
                      content: true,
                      createdAt: true,
                      author: { select: { id: true, name: true, image: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                  },
                },
            });
            console.log(blog?.comments)
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

    getBlogByTags: publicProcedure
      .input(z.object({
        page: z.number().int().positive().optional().default(1),
        limit: z.number().int().positive().optional().default(10),
        tag: z.string(),
      }))
      .query(async ({ctx, input}) => {
        const skip = (input.page - 1) * input.limit;
        const [blogs, totalBlogs] = await Promise.all([
          ctx.db.blog.findMany({
            skip: skip,
            take: input.limit,
            orderBy: { publishDate: 'desc' },
            where: {
              tags: {
                some: {
                  name: {
                    equals: input.tag,
                    mode: 'insensitive' 
                  }
                }
              }
            },
            include: {
              tags: true,
              author: true,
            },
          }),
          ctx.db.blog.count({
            where: {
              tags: {
                some: {
                  name: {
                    equals: input.tag,
                    mode: 'insensitive' 
                  }
                }
              }
            }
          }) 
        ]);

        return {
          blogs,
          total: totalBlogs,
          totalPages: Math.ceil(totalBlogs / input.limit),
          currentPage: input.page
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


    
  fullTextSearch: publicProcedure
  .input(z.object({
    searchTerm: z.string().min(1, { message: "Search term cannot be empty" }),
    slug: z.string().optional(),
    page: z.number().int().positive().optional().default(1), 
    limit: z.number().int().min(1).optional().default(4)
  }))
  .query(async ({ ctx, input }) => {
    try {
      const whereClause: Prisma.BlogWhereInput = {
        OR: [
          { title: { contains: input.searchTerm, mode: 'insensitive' } },
          // { content: { contains: input.searchTerm, mode: 'insensitive' } },
          { tags: { some: { name: { contains: input.searchTerm, mode: 'insensitive' } } } },
          // { keywords: { has: input.searchTerm } } 
        ],
        ...(input.slug && { slug: { contains: input.slug, mode: 'insensitive' } })
      };
      const skipValue = (input.page - 1) * input.limit;
      const [results, totalCount] = await ctx.db.$transaction([
        ctx.db.blog.findMany({
          where: whereClause,
          select: { 
            id: true,
            title: true,
            slug: true,
            metaDescription: true, 
            imageUrl: true,
            imageAlt: true,
            publishDate: true,
            author: { 
              select: {
                id: true,
                name: true,
                image: true
              }
            },
            tags: { 
              select: {
                id: true,
                name: true
              }
            },
          },
          orderBy: {
            publishDate: 'desc'
          },
          take: input.limit,
          skip: skipValue,
        }),
        ctx.db.blog.count({ where: whereClause })
      ]);
      return {
        results,
        totalCount,
        currentPage: input.page,
        totalPages: Math.ceil(totalCount / input.limit),
      };

    } catch (error) {
      console.error('Error in fullTextSearch:', error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to perform search',
        cause: error instanceof Error ? error : undefined,
      });
    }
  }),


  viewCount: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input, ctx }) => { 
      const decodedSlug = decodeURIComponent(input.slug);
      const blog = await ctx.db.blog.findUnique({
        where: { slug: decodedSlug },
        select: { id: true, views: true }
      });

      if (!blog) throw new Error("Blog not found");

      const updateBlog = await ctx.db.blog.update({
        where: { id: blog.id },
        data: { views: blog.views + 1 },
        select: { views: true }
      });
      
      return updateBlog.views;
  }),

  getViews: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const blog = await ctx.db.blog.findUnique({
        where: { slug: decodeURIComponent(input.slug) },
        select: { views: true }
      });
      return blog?.views ?? 0;
  }),

  getLeaderBoard: publicProcedure
    .input(z.object({
    authorLimit: z.number().int().positive().optional().default(5),
    blogLimit: z.number().int().positive().optional().default(5),
  })) .query(async ({input, ctx}) => {
    const topAuthors = await ctx.db.user.findMany({
      take: input.authorLimit,
      orderBy: {
        blogs: {
          _count: 'desc'
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            blogs: true,
          }
        }
      }
    })
    const topViewedBlogs = await ctx.db.blog.findMany({
      take: input.blogLimit,
      orderBy: {
        views: 'desc'
      },
      select: {
        id: true,
        title: true,
        views: true,
        slug: true,
        author: {
          select: {
            name: true,
          }
        },
        publishDate: true,
      }
    })

    const formattedAuthors = topAuthors.map((author) => ({
      id: author.id,
      name: author.name || 'Ẩn danh',
      blogCount: author._count.blogs,
      avatar: author.image || ''
    }))

    const formattedBlogs = topViewedBlogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      views: blog.views,
      author: blog.author.name || 'Ẩn danh',
      slug: blog.slug,
      publish_day: blog.publishDate
    }));
    return {
      topAuthors: formattedAuthors,
      topViewedBlogs: formattedBlogs,
    };
  }),
  addComment: publicProcedure
  .input(z.object({ 
    slug: z.string(),   
    content: z.string().min(1),
    name: z.string().optional(),
    email: z.string().email().optional(), 
  }))
  .mutation(async ({ input, ctx }) => {
    if (!ctx.session?.user && (!input.name || !input.email)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Name and email are required for guest comments',
      })
    }
    const comment = await ctx.db.comment.create({
      data: {
        content: input.content,
        blog: {
          connect: {
            slug: input.slug
          }
        },
        author: ctx.session?.user
          ? { connect: { id: ctx.session.user.id } }
          : {
              create: {
                name: input.name!,
                email: input.email!,
              },
            },
      },
      include: {
        author: true,
      },
    })
    
    revalidateTag("blog");
    
    return comment
  }),
  listBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.comment.findMany({
        where: { 
          blog: {
            slug: input.slug
          }
        },
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      })
  }),
});
