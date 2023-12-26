"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (session) {
    return (
      <Button onClick={() => signOut()}>
        SignOut
      </Button>
    );
  }
  return (
    <div className="">
      <Button onClick={() => signIn("google")}>Sign in</Button>
    </div>
  );
}
