import OpenAI from 'openai';

const getOpenAIInstance = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export interface AIRecipeResponse {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export async function generateAIRecipe(ingredients: string[]): Promise<AIRecipeResponse> {
  const prompt = `
    Create a recipe using these ingredients: ${ingredients.join(', ')}.
    Follow this JSON format exactly, ensure all numbers are numeric not strings:
    {
      "title": "[Creative name]",
      "description": "[Brief description]",
      "ingredients": ["[List with measurements]"],
      "instructions": ["[Clear steps]"],
      "prepTime": [number],
      "cookTime": [number],
      "nutrition": {
        "calories": [number],
        "protein": [number],
        "carbs": [number],
        "fat": [number]
      }
    }`;

  try {
    const openai = getOpenAIInstance();
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error('No response from AI');
    
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Recipe generation failed');
  }
}
