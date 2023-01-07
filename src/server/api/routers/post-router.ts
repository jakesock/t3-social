import {
  createPostInputSchema,
  likeUnlikePosttInputSchema,
  timelineInputSchema,
} from "@/lib/schemas/post-schemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure.input(createPostInputSchema).mutation(({ ctx, input }) => {
    const { prisma, session } = ctx;
    const { text } = input;

    const userId = session.user.id;

    return prisma.post.create({
      data: {
        text,
        author: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),

  timeline: publicProcedure.input(timelineInputSchema).query(async ({ ctx, input }) => {
    const { prisma } = ctx;
    const { cursor, limit, where } = input;
    const userId = ctx.session?.user?.id;

    const posts = await prisma.post.findMany({
      take: limit + 1,
      where,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        likes: {
          where: {
            userId,
          },
          select: {
            userId: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    let nextCursor: typeof cursor | undefined = undefined;
    if (posts.length > limit) {
      const nextItem = posts.pop() as typeof posts[number];
      nextCursor = nextItem.id;
    }

    return {
      posts,
      nextCursor,
    };
  }),

  like: protectedProcedure.input(likeUnlikePosttInputSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { prisma } = ctx;

    return prisma.like.create({
      data: {
        post: {
          connect: {
            id: input.postId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }),

  unlike: protectedProcedure.input(likeUnlikePosttInputSchema).mutation(async ({ ctx, input }) => {
    const userId = ctx.session.user.id;
    const { prisma } = ctx;

    return prisma.like.delete({
      where: {
        postId_userId: {
          postId: input.postId,
          userId,
        },
      },
    });
  }),
});
