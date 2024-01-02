import { db } from "@/lib/db/index";
 

const getTask = async () => {
  const t = await db.task.findMany({ include: { user: true } })
  
  console.log("hjsgfjhsdgfjshfdf", t)

  return t
} 

getTask()
