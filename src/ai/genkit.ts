/**
 * @fileOverview The Genkit AI configuration.
 */
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// This is a default AI setup that can be used if no API key is provided by the user.
// However, flows should prioritize using a user-provided key if available.
export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
