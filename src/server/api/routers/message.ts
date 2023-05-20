import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { createOpenAICompletion } from "~/external/openai/chatGPTApi";
import { ChatGPTMessage } from "~/external/openai/chatGPTMessage";
import { parseActionCode, stringifyActionCode } from "~/external/openai/chatGPTActionItems";

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

  generateGPT: protectedProcedure.mutation(async ({ ctx }) => {
    const todoList = await ctx.prisma.todo.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
    const lastNMessages = await ctx.prisma.message.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        character: true,
      },
    });
    const character = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    }).activeCharacter();

    const chatGptResponse = await createOpenAICompletion(
      {
        type: "assistant",
        characterDescription: character?.content ?? "The depressed robot from Hitchhiker's Guide to the Galaxy",
        characterName: character?.name ?? "Marvin",
        actions: []
      },
      todoList,
      lastNMessages.reverse().map((message) => {
        if (message.isGPT) {
          return {
            type: "assistant",
            characterDescription: message.character?.content,
            characterName: message.character?.name,
            actions: parseActionCode(message.content),
          } as ChatGPTMessage;
        }
        return {
          type: "user",
          content: message.content,
        } as ChatGPTMessage;
      }),
    );

    for (const action of chatGptResponse.actions) {
      if (action.type === "add") {
        await ctx.prisma.todo.create({
          data: {
            title: action.content,
            due: action.due,
            authorId: ctx.session.user.id,
          },
        });
      }
      if (action.type === "complete") {
        await ctx.prisma.todo.update({
          where: {
            id: action.id,
          },
          data: {
            done: true,
          },
        });
      }
      if (action.type === "delete") {
        await ctx.prisma.todo.delete({
          where: {
            id: action.id,
          },
        });
      }
      if (action.type === "uncomplete") {
        await ctx.prisma.todo.update({
          where: {
            id: action.id,
          },
          data: {
            done: false,
          },
        });
      }
    }

    return ctx.prisma.message.create({
      data: {
        content: stringifyActionCode(chatGptResponse.actions),
        authorId: ctx.session.user.id,
        isGPT: true,
        characterId: character?.id,
      },
    });
  }),

  findAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
      include: {
        character: true,
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  deleteAll: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.message.deleteMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),
});
