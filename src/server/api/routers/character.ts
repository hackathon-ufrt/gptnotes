import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const characterRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(20),
        content: z.string().min(1).max(200),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.character.create({
        data: {
          name: input.name,
          content: input.content,
          authorId: ctx.session.user.id,
        },
      });
    }),

  findAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.character.findMany({
      where: {},
    });
  }),

  setActiveCharacter: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          activeCharacterId: input.id,
        },
      });
    }),
});
