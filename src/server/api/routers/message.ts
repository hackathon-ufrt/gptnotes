import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const messageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1).max(200),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.message.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),

  generateGPT: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.message.create({
      data: {
        content: "Hello World from not GPT",
        authorId: ctx.session.user.id,
        isGPT: true,
      },
    });
  }),

  findAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),
});
