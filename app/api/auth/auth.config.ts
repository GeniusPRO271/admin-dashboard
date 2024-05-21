import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}/dashboard`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return `${baseUrl}/dashboard`
      return `${baseUrl}/dashboard`
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnBoard = nextUrl.pathname.startsWith('/board');
      if (isOnDashboard || isOnBoard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;
