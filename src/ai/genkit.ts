import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Make sure you have a GEMINI_API_KEY environment variable set in a .env file
if (!process.env.GEMINI_API_KEY) {
  console.warn(
    'GEMINI_API_KEY environment variable not set. Using a placeholder.'
  );
}

export const ai = genkit({
  plugins: [
    googleAI(),
  ].filter(p => !!p) as any,
  model: 'google/gemini-1.5-flash',
});
