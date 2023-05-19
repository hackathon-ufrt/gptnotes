import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const todoRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().max(100),
        dueDate: z.date(),
        content: z.optional(z.string()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.create({
        data: {
          title: input.title,
          due: input.dueDate,
          content: input.content,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        dueDate: z.date(),
        content: z.optional(z.string()),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          due: input.dueDate,
          content: input.content,
        },
      });
    }),

  findById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.todo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  findAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
