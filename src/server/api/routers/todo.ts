import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().max(100),
        dueDate: z.date(),
        content: z.optional(z.string().max(1000)),
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

  check: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().max(100),
        dueDate: z.date(),
        content: z.optional(z.string().max(1000)),
      })
    )
    .mutation(({ input, ctx }) => {
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

  findAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),
});
