import { db } from "@/lib/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import { redirect } from "next/navigation";
import { env } from "@/lib/env.mjs";
import GoogleProvider from "next-auth/providers/google";
import { getStaffs } from "../api/staffs/queries";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "USER";
    };
  }
}

// const emailPermission = [
//   "trieunguyen2806@gmail.com",
//   "trieunc@suzu.group",
//   "networksocialtest@gmail.com",
//   "khanh@suzu.vn",
//   "tran@dinhkhanh.dk",
//   "dat@suzu.vn",
//   "tamptm@suzu.group",
//   "hang@suzu.vn",
// ];

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
      image?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        if (
          [
            "trieunguyen2806@gmail.com",
            "khanh@suzu.vn",
            "dat@suzu.vn",
            "hang@suzu.vn",
          ].includes(user.email)
        ) {
          session.user.role = "ADMIN";
        } else {
          session.user.role = "USER";
        }
      }
      return session;
    },
    async signIn({ user }) {
      const dataUser = await getStaffs();
      const emailPermission = dataUser.staffs.map((item) => item.email);
      if (
        user.email &&
        (emailPermission.includes(user.email) ||
          user.email === "trieunguyen2806@gmail.com")
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect("/");
};
