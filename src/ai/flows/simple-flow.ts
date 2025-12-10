'use server';

/**
 * @fileOverview A simple AI flow.
 *
 * - simpleFlow - A function that handles a simple AI flow.
 * - SimpleFlowInput - The input type for the simpleFlow function.
 * - SimpleFlowOutput - The return type for the simpleFlow function.
 */

import { ai } from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI as googleAIPlugin} from '@genkit-ai/google-genai';

const SimpleFlowInputSchema = z.object({
  question: z.string().describe('The question to ask the AI.'),
  apiKey: z.string().describe('The Gemini API key.'),
});
export type SimpleFlowInput = z.infer<typeof SimpleFlowInputSchema>;

const SimpleFlowOutputSchema = z.object({
  answer: z.string().describe('The answer from the AI.'),
});
export type SimpleFlowOutput = z.infer<typeof SimpleFlowOutputSchema>;

export async function simpleFlow(
  input: SimpleFlowInput
): Promise<SimpleFlowOutput> {
  return await simpleFlowFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simpleFlowPrompt',
  input: {schema: SimpleFlowInputSchema},
  output: {schema: SimpleFlowOutputSchema},
  prompt: `You are a helpful AI assistant. Answer the following question:
Question: {{{question}}}`,
});

const simpleFlowFlow = ai.defineFlow(
  {
    name: 'simpleFlow',
    inputSchema: SimpleFlowInputSchema,
    outputSchema: SimpleFlowOutputSchema,
  },
  async input => {
    // Create a temporary Genkit instance with the user's API key.
    // This isn't ideal, but it's a simple way to handle per-request keys.
    const tempAi = {
       ...ai,
       generate: (options: any) => {
           const googleAI = googleAIPlugin({apiKey: input.apiKey});
           const dynamicAi = {
            plugins: [googleAI],
            logLevel: 'debug',
            enableTracingAndMetrics: true,
           };
           return ai.generate({ ...options, ...dynamicAi });
       }
    };
    
    const {output} = await tempAi.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: `You are a helpful AI assistant. Answer the following question:
      Question: ${input.question}`,
      output: {
        schema: SimpleFlowOutputSchema,
      },
    });

    return output!;
  }
);
