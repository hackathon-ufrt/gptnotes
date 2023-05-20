import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
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
          authorId: ctx.session.user.id,
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
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!todo) {
        throw new Error("No such todo");
      }

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
        title: z.string().min(1).max(100),
        dueDate: z.date(),
        content: z.optional(z.string().max(1000)),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!todo) {
        throw new Error("No such todo");
      }

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

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const todo = await ctx.prisma.todo.findFirst({
        where: {
          id: input.id,
          authorId: ctx.session.user.id,
        },
      });

      if (!todo) {
        throw new Error("No such todo");
      }

      return ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  findAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),
});
