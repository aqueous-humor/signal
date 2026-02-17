import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("DB AUTH CHECK:", credentials?.email);

        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          console.log("User not found in DB");
          return null;
        }

        const isValid = await argon2.verify(
          user.passwordHash,
          credentials.password as string,
        );

        if (!isValid) {
          console.log("Password mismatch");
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          workspaceId: user.workspaceId,
        };
      },
    }),
  ],
});
