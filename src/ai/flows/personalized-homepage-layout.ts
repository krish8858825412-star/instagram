'use server';

/**
 * @fileOverview Uses GenAI to suggest a personalized and informative layout for the user's home page after login.
 *
 * - personalizedHomepageLayout - A function that handles the personalized home page layout generation.
 * - PersonalizedHomepageLayoutInput - The input type for the personalizedHomepageLayout function.
 * - PersonalizedHomepageLayoutOutput - The return type for the personalizedHomepageLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHomepageLayoutInputSchema = z.object({
  userInfo: z
    .string()
    .describe('Information about the user, including their interests, preferences, and usage history.'),
});
export type PersonalizedHomepageLayoutInput = z.infer<typeof PersonalizedHomepageLayoutInputSchema>;

const PersonalizedHomepageLayoutOutputSchema = z.object({
  layoutSuggestion: z
    .string()
    .describe(
      'A suggestion for the layout of the home page, including sections, content types, and visual elements.'
    ),
});
export type PersonalizedHomepageLayoutOutput = z.infer<typeof PersonalizedHomepageLayoutOutputSchema>;

export async function personalizedHomepageLayout(input: PersonalizedHomepageLayoutInput): Promise<PersonalizedHomepageLayoutOutput> {
  return personalizedHomepageLayoutFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHomepageLayoutPrompt',
  input: {schema: PersonalizedHomepageLayoutInputSchema},
  output: {schema: PersonalizedHomepageLayoutOutputSchema},
  prompt: `You are an expert in user interface design and information architecture. Based on the user information provided, suggest a personalized and informative layout for their home page.

User Information: {{{userInfo}}}

Consider the following aspects when generating the layout suggestion:

- Sections: Suggest relevant sections for the home page, such as "Latest News," "Recommended Content," "Quick Actions," etc.
- Content Types: Recommend appropriate content types for each section, such as articles, videos, images, links, etc.
- Visual Elements: Suggest visual elements to enhance the user experience, such as carousels, grids, lists, etc.

Provide a detailed description of the layout suggestion, including the sections, content types, and visual elements for the home page.  The layout suggestion should optimize for visual appeal and informative content.

Layout Suggestion:`,
});

const personalizedHomepageLayoutFlow = ai.defineFlow(
  {
    name: 'personalizedHomepageLayoutFlow',
    inputSchema: PersonalizedHomepageLayoutInputSchema,
    outputSchema: PersonalizedHomepageLayoutOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
