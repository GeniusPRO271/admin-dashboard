import { authConfig } from 'app/api/auth/auth.config';
import NextAuth from 'next-auth';

 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/board", "/dashboard/:path*"]
};