import { postRouter } from "./routers/post-router";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
});

export type AppRouter = typeof appRouter;
