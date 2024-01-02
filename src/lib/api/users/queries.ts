import { db } from "@/lib/db/index";
import { getUserAuth } from "@/lib/auth/utils";
import { userIdSchema } from "@/lib/db/schema/users";

export const getUsers = async () => {
    const { session } = await getUserAuth();
    const u = await db.user.findMany({ where: { id: { not: session?.user.id } }, include: {tasks: true} });
    return { users: u };
};
// export const getUserById = async () => {
//     const { session } = await getUserAuth();
//     //@ts-ignore
//     return await db.user.findFirst({
//         where: { id: id },
//     });
// };