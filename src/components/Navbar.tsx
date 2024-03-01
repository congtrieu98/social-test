import { getUserAuth } from "@/lib/auth/utils";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SignOutButton from "./auth/SignOutButton";
import NotificationMenu from "./NotificationMenu";
import { ROLE } from "@/utils/constant";

export default async function Navbar() {
  const { session } = await getUserAuth();
  const nameExists = !!session?.user.name && session?.user.name.length > 5;
  if (session?.user) {
    return (
      <nav className="py-2 flex items-center justify-between transition-all duration-300">
        <h1 className="font-semibold transition-hover cursor-pointer">
          <Link href="/" className="hover:opacity-75">
            Home
          </Link>
        </h1>
        <h1 className="font-semibold transition-hover cursor-pointer">
          <Link href="/tasks" className="hover:opacity-75">
            Tasks
          </Link>
        </h1>
        <h1 className="font-semibold transition-hover cursor-pointer">
          <Link href="/kpi" className="hover:opacity-75">
            KPI
          </Link>
        </h1>
        <h1 className="font-semibold transition-hover cursor-pointer">
          <Link href="/task-default" className="hover:opacity-75">
            Sky
          </Link>
        </h1>
        <div className="space-x-2 flex items-center">
          {session ? (
            <>
              <NotificationMenu />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage
                      src={session?.user.image ? session?.user.image : ""}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <span className="font-semibold">
                      {nameExists ? session.user.name : "New User"}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/account">
                    <DropdownMenuItem className="cursor-pointer">
                      Tài khoản
                    </DropdownMenuItem>
                  </Link>
                  {session?.user.role === ROLE.ADMIN && (
                    <Link href="/staffs">
                      <DropdownMenuItem className="cursor-pointer">
                        Người dùng
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <SignOutButton />
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/sign-in">Sign in</Link>
          )}
        </div>
      </nav>
    );
  } else return null;
}
