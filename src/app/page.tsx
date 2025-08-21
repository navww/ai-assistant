'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <p>Signed in as {session.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
        <a href="/chat">
          <Button>Go to Chat</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Button onClick={() => signIn('google')}>Sign in with Google</Button>
      <Button onClick={() => signIn('github')}>Sign in with GitHub</Button>
    </div>
  );
}
