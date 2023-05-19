import {createTRPCRouter} from "~/server/api/trpc";
import {todoRouter} from "~/server/api/routers/todo";
import {messageRouter} from "~/server/api/routers/message";
import {characterRouter} from "~/server/api/routers/character";
import {meRouter} from "~/server/api/routers/me";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  message: messageRouter,
  character: characterRouter,
  me: meRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
