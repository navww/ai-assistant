'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { continueConversation } from './actions';
import { getHistory } from './get-history';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { saveHistory } from './save-history';

// Helper to get text content from a UIMessage
function getMessageContent(message: UIMessage): string {
  for (const part of message.parts) {
    if (part.type === 'text') {
      return part.text;
    }
  }
  return '';
}

export default function ChatPage() {
  const { data: session } = useSession();
  const { messages, setMessages } = useChat({
    async onFinish() {
      // Filter for user and assistant messages before saving
      const historyToSave = messages
        .filter(
          (m): m is UIMessage & { role: 'user' | 'assistant' } =>
            m.role === 'user' || m.role === 'assistant',
        )
        .map((m) => ({
          role: m.role,
          content: getMessageContent(m),
        }));
      await saveHistory(historyToSave);
    },
  });

  // Manage input state manually
  const [input, setInput] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (session?.user?.id) {
      getHistory(session.user.id).then((history) => {
        // Transform history to UIMessage format
        const uiMessages: UIMessage[] = history.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          parts: [{ type: 'text', text: msg.content }],
        }));
        setMessages(uiMessages);
      });
    }
  }, [session, setMessages]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
          {getMessageContent(m)}
        </div>
      ))}

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim()) return;

          const userMessage: UIMessage = {
            id: Date.now().toString(),
            role: 'user',
            parts: [{ type: 'text', text: input }],
          };

          const newMessages = [...messages, userMessage];
          setMessages(newMessages);
          setInput(''); // Clear input after sending

          // Transform messages for the server action
          const historyForAction = newMessages
            .filter(
              (m): m is UIMessage & { role: 'user' | 'assistant' } =>
                m.role === 'user' || m.role === 'assistant',
            )
            .map((m) => ({
              role: m.role,
              content: getMessageContent(m),
            }));

          const stream = await continueConversation(historyForAction);

          // Handle the stream
          const reader = stream.getReader();
          let fullResponse = '';
          const assistantMessageId = Date.now().toString();

          // Add a placeholder for the assistant message
          const assistantMessage: UIMessage = {
            id: assistantMessageId,
            role: 'assistant',
            parts: [{ type: 'text', text: '' }],
          };
          setMessages([...newMessages, assistantMessage]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            fullResponse += value;
            setMessages(currentMessages => {
              const lastMessage = currentMessages[currentMessages.length - 1];
              if (lastMessage.id === assistantMessageId) {
                const updatedMessage: UIMessage = {
                  ...lastMessage,
                  parts: [{ type: 'text', text: fullResponse }],
                };
                return [...currentMessages.slice(0, -1), updatedMessage];
              }
              return currentMessages;
            });
          }
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
