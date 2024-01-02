import { initTRPC } from '@trpc/server';
import { z } from 'zod';

type Context = {
  foo: string;
};

const t = initTRPC.context<Context>().create();

const publicProcedure = t.procedure;
//@ts-ignore
const { createCallerFactory, router } = t;

interface Post {
  id: string;
  title: string;
}
const posts: Post[] = [
  {
    id: '1',
    title: 'Hello world',
  },
];
const appRouter = router({
  post: router({
    add: publicProcedure
      .input(
        z.object({
          title: z.string().min(2),
        }),
      )
      .mutation((opts) => {
        const post: Post = {
          ...opts.input,
          id: `${Math.random()}`,
        };
        posts.push(post);
        return post;
      }),
    list: publicProcedure.query(() => posts),
  }),
});

// 1. create a caller-function for your router
const createCaller = createCallerFactory(appRouter);

// 2. create a caller using your `Context`
const caller = createCaller({
  foo: 'bar',
});

// 3. use the caller to add and list posts
const addedPost =  caller.post.add({
  title: 'How to make server-side call in tRPC',
});

const postList =  caller.post.list();
console.log("addedPost", addedPost)
console.log("yueregfgdfgdfbj")
console.log("yueregfgdfgdfbj")
console.log("postList:", postList)
console.log("yueregfgdfgdfbj")
console.log("yueregfgdfgdfbj")
console.log("yueregfgdfgdfbj")