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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SignOutButton from "./auth/SignOutButton";
import { ROLE } from "@/utils/constant";
import NotificationMenu from "./NotificationMenu";

export default async function Navbar() {
  const { session } = await getUserAuth();
  const nameExists = !!session?.user.name && session?.user.name.length > 5;

  if (session?.user) {
    return (
      <nav className="py-2 flex items-center justify-between transition-all duration-300">
        <h1 className="font-semibold transition-hover cursor-pointer space-x-3">
          <Link href="/" className="hover:opacity-75">
            Logo
          </Link>
          <Link href="/tasks" className="hover:opacity-75">
            Tasks
          </Link>
          <Link href="/kpi" className="hover:opacity-75">
            KPI
          </Link>
          <Link
            href="https://github.com/congtrieu98/task"
            className="hover:opacity-75"
          >
            Github
          </Link>
        </h1>
        <div className="space-x-2 flex items-center">
          {session ? (
            <>
              <NotificationMenu />
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback>
                      {nameExists
                        ? session.user.role === ROLE.ADMIN
                          ? "AD"
                          : session.user.name
                              ?.split(" ")
                              .map((word) => word[0].toUpperCase())
                              .join("")
                        : "~"}
                    </AvatarFallback>
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
                      Account
                    </DropdownMenuItem>
                  </Link>
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
