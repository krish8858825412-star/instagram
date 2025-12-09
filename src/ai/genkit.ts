import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ].filter(p => !!p) as any,
  model: 'google/gemini-1.5-flash',
});
