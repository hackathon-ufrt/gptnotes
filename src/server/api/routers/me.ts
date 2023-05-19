import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const meRouter = createTRPCRouter({
  getMe: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      include: {
        activeCharacter: true,
      },
    });
  }),
});
