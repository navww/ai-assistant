import { db } from '@/db';
import { messages } from '@/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export async function saveHistory(history: { role: 'user' | 'assistant'; content: string }[]) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return;
  }

  const userId = session.user?.id;

  if (!userId) {
    return;
  }

  const historyToSave = history.map((message) => ({
    userId,
    content: message.content,
    isUser: message.role === 'user',
  }));

  await db.insert(messages).values(historyToSave);
}
