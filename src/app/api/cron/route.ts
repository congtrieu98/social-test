import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { db } from "@/lib/db/index";
 
// const posts = ['One', 'Two', 'Three'];
 
// const t = initTRPC.create();
// const router = t.router({
//   post: t.router({
//     add: t.procedure.input(z.string()).mutation((opts) => {
//       posts.push(opts.input);
//       return posts;
//     }),
//   }),
// });
 
// const caller = router.createCaller({});
// const result =  caller.post.add('Four');
const getTask = async () => {
  const t = await db.task.findMany({ include: { user: true } })
  
  console.log("hjsgfjhsdgfjshfdf", t)
console.log("hjsgfjhsdgfjshfdf", t)
console.log("hjsgfjhsdgfjshfdf", t)
console.log("hjsgfjhsdgfjshfdf", t)
  return t
} 

getTask()
