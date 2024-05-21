import axios from 'axios';
import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
async function loginUser(email: string, password: string) {
  const url = 'https://lock-system.up.railway.app/v1/user/login';
  const data = {
    Email: email,
    Password: password
  };

  try {
    const response = await axios.post(url, data);
    return response.data.user_data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        console.log("request= ", req)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user: User = await loginUser(email, password);
          if (!user) return null;
          else if (user.role != 'Admin') return null;

          return user as User;
        }

        console.log('Invalid credentials');
        return null;
      }
    })
  ],
});
