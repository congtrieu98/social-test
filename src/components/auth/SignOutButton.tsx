"use client";
import { signOut } from "next-auth/react";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function SignOutButton() {
  return (
    <span onClick={() => signOut()}>
      <DropdownMenuItem className="cursor-pointer">Đăng xuất</DropdownMenuItem>
    </span>
  );
}
