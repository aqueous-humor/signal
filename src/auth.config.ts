import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/login", // Redirects unauthenticated users here
    newUser: "/register", // Can be used for post-OAuth onboarding
  },
  providers: [], //The real provider will be injected in auth.ts
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.workspaceId = user.workspaceId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.workspaceId = token.workspaceId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
