import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { findOrCreateUser, getUserByEmail } from "@/actions/userActions";

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
    async jwt({ token }) {
      // 초기 로그인이나 토큰 업데이트 시에만 DB 조회
      if (token?.email) {
        try {
          const dbUser = await getUserByEmail(token.email);
          if (dbUser) {
            token.id = dbUser.id;
            token.email = dbUser.email;
            token.name = dbUser.name;
            token.image = dbUser.image;
            // 필요한 다른 DB 필드들도 추가
          }
        } catch (error) {
          console.error("Error fetching user from database:", error);
        }
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
  // pages: {
  //   signIn: "/",
  // },
});
