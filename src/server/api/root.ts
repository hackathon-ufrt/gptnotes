import {createTRPCRouter} from "~/server/api/trpc";
import {exampleRouter} from "~/server/api/routers/example";
import {todoRouter} from "~/server/api/routers/todo";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
