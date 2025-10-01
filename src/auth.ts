import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser } from "@/actions/userActions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // When user signs in, save/update their info in our database
      if (account?.provider === "google" && user.email) {
        try {
          await findOrCreateUser(
            user.email,
            user.name || null,
            user.image || null,
            account.providerAccountId,
          );
          return true;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      // Add the provider account ID to the token on first sign in
      if (account?.providerAccountId) {
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
