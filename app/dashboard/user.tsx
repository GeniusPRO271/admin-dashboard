import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getToken } from "next-auth/jwt"
import Link from 'next/link';
import { auth, signOut } from 'app/api/auth/[...nextauth]';

export async function User() {
  const session = await auth();
  const user = session?.user;



  console.log(session?.expires);

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="default" className='border'>Sign In</Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button variant="default" className='border hover:bg-card-hover'>Sign Out</Button>
      </form>
    </div>
  );
}
