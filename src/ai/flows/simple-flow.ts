'use server';

/**
 * @fileOverview A simple AI flow.
 *
 * - simpleFlow - A function that handles a simple AI flow.
 * - SimpleFlowInput - The input type for the simpleFlow function.
 * - SimpleFlowOutput - The return type for the simpleFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimpleFlowInputSchema = z.object({
  question: z.string().describe('The question to ask the AI.'),
});
export type SimpleFlowInput = z.infer<typeof SimpleFlowInputSchema>;

const SimpleFlowOutputSchema = z.object({
  answer: z.string().describe('The answer from the AI.'),
});
export type SimpleFlowOutput = z.infer<typeof SimpleFlowOutputSchema>;

export async function simpleFlow(
  input: SimpleFlowInput
): Promise<SimpleFlowOutput> {
  const {answer} = await simpleFlowFlow(input);
  return {answer};
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
    const {output} = await prompt(input);
    return {answer: output!.answer};
  }
);
