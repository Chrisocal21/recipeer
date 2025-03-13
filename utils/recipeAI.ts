import type { Recipe } from '@/store/useRecipeStore';
import { generateAIRecipe, AIRecipeResponse } from './openai';

const RECIPE_TEMPLATES = {
  'Stir-Fry': {
    instructions: [
      'Heat oil in a large wok or skillet',
      'Add protein and cook until done',
      'Add vegetables and stir-fry',
      'Season with sauce and serve'
    ],
    cookTime: 20,
    prepTime: 15
  },
  'Baked': {
    instructions: [
      'Preheat oven to 375°F',
      'Prepare ingredients in baking dish',
      'Bake until golden brown',
      'Let rest before serving'
    ],
    cookTime: 35,
    prepTime: 20
  },
  'Soup': {
    instructions: [
      'Sauté aromatics in pot',
      'Add liquid and bring to boil',
      'Simmer until ingredients are tender',
      'Season and serve hot'
    ],
    cookTime: 45,
    prepTime: 15
  }
} as const;

export async function generateRecipes(ingredients: string[]): Promise<Partial<Recipe>[]> {
  try {
    const aiRecipe = await generateAIRecipe(ingredients);
    return [{
      name: aiRecipe.title,
      description: aiRecipe.description,
      ingredients: aiRecipe.ingredients.join('\n'),
      instructions: aiRecipe.instructions.join('\n'),
      prepTime: aiRecipe.prepTime,
      cookTime: aiRecipe.cookTime,
      nutrition: aiRecipe.nutrition,
      author: 'AI Chef',
      generated: true,
      lastModified: Date.now()
    }];
  } catch (error) {
    console.error('AI Recipe generation failed:', error);
    return fallbackGenerateRecipes(ingredients);
  }
}

function fallbackGenerateRecipes(ingredients: string[]): Partial<Recipe>[] {
  return ingredients.map(mainIngredient => {
    const template = selectBestTemplate(mainIngredient, ingredients);
    
    return {
      name: `${mainIngredient} ${template.name}`,
      description: `A delicious ${template.name.toLowerCase()} featuring ${mainIngredient}`,
      ingredients: ingredients.map(i => `1 portion ${i}`).join('\n'),
      instructions: template.instructions.join('\n'),
      prepTime: template.prepTime,
      cookTime: template.cookTime,
      nutrition: {
        calories: 300 + Math.floor(Math.random() * 200),
        protein: 15 + Math.floor(Math.random() * 15),
        carbs: 30 + Math.floor(Math.random() * 20),
        fat: 10 + Math.floor(Math.random() * 10)
      },
      author: 'AI Chef',
      generated: true
    };
  });
}

function selectBestTemplate(mainIngredient: string, otherIngredients: string[]) {
  // Simple template selection logic
  const templateEntries = Object.entries(RECIPE_TEMPLATES);
  const randomIndex = Math.floor(Math.random() * templateEntries.length);
  const [name, template] = templateEntries[randomIndex];
  return { name, ...template };
}
