
import { publicProcedure, router } from "@/lib/server/trpc";
import { getUsers } from "@/lib/api/users/queries";


export const usersRouter = router({
    getUsers: publicProcedure.query(async () => {
        return getUsers();
    }),
    // getUserById: publicProcedure.query(async () => {
    //     return getUserById();
    // })

});
