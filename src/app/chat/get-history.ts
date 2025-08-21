import { db } from '@/db';
import { messages } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export async function getHistory(userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return [];
  }

  const history = await db
    .select()
    .from(messages)
    .where(eq(messages.userId, userId));

  return history.map((message) => ({
    id: message.id.toString(),
    role: message.isUser ? 'user' : 'assistant',
    content: message.content,
  }));
}
