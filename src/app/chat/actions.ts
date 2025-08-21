'use server';

import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { weatherTool, f1MatchesTool, stockPriceTool } from './tools';

export async function continueConversation(history: { role: 'user' | 'assistant'; content: string }[]) {
  'use server';
  const { textStream } = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: history,
    tools: {
      getWeather: weatherTool,
      getF1Matches: f1MatchesTool,
      getStockPrice: stockPriceTool,
    },
  });

  return textStream;
}
