import { z } from 'zod';
import { tool } from 'ai';

// Schema for weather tool parameters
const weatherParameters = z.object({
  location: z.string().describe('The location to get the weather for'),
});

// Schema for weather tool results
const weatherResult = z.object({
  location: z.string(),
  temperature: z.number(),
  unit: z.string(),
});

export const weatherTool = tool<typeof weatherParameters, typeof weatherResult>({
  name: 'getWeather',
  description: 'Get the weather for a location',
  parameters: weatherParameters,
  async execute({ location }) {
    // In a real application, you would call an API to get the weather.
    // For this example, we'll just return a mock response.
    return {
      location,
      temperature: Math.floor(Math.random() * 30),
      unit: 'C',
    };
  },
});

// Schema for F1 tool parameters
const f1MatchesParameters = z.object({});

// Schema for F1 tool results
const f1MatchesResult = z.object({
  race: z.string(),
  date: z.string(),
});

export const f1MatchesTool = tool<
  typeof f1MatchesParameters,
  typeof f1MatchesResult
>({
  name: 'getF1Matches',
  description: 'Get the next Formula 1 race',
  parameters: f1MatchesParameters,
  async execute({}) {
    // In a real application, you would call an API to get the next F1 race.
    // For this example, we'll just return a mock response.
    return {
      race: 'Monaco Grand Prix',
      date: '2024-05-26',
    };
  },
});

// Schema for stock price tool parameters
const stockPriceParameters = z.object({
  symbol: z.string().describe('The stock symbol to get the price for'),
});

// Schema for stock price tool results
const stockPriceResult = z.object({
    symbol: z.string(),
    price: z.number(),
});

export const stockPriceTool = tool<typeof stockPriceParameters, typeof stockPriceResult>({
  name: 'getStockPrice',
  description: 'Get the stock price for a stock symbol',
  parameters: stockPriceParameters,
  async execute({ symbol }) {
    // In a real application, you would call an API to get the stock price.
    // For this example, we'll just return a mock response.
    return {
      symbol,
      price: Math.floor(Math.random() * 1000),
    };
  },
});
