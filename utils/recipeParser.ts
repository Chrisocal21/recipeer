import { Recipe } from '@/store/useRecipeStore';

interface ParsedRecipe extends Partial<Recipe> {}

export function parseRecipeText(text: string): ParsedRecipe {
  const recipe: ParsedRecipe = {
    name: '',
    description: '',
    author: 'Unknown',
    nutrition: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    prepTime: 0,
    cookTime: 0
  };

  const lines = text.split('\n').map(line => line.trim());
  
  // Name is required
  recipe.name = lines.find(line => line === line.toUpperCase()) || lines[0] || 'Imported Recipe';
  
  // Description from first non-empty line after name
  const descIndex = lines.findIndex((line, i) => i > 0 && line.length > 0);
  if (descIndex > -1) {
    recipe.description = lines[descIndex];
  }
  
  // Look for ingredients section
  const ingredientsStart = lines.findIndex(line => 
    line.toLowerCase().includes('ingredient')
  );
  if (ingredientsStart > -1) {
    recipe.ingredients = lines
      .slice(ingredientsStart + 1)
      .filter(line => line.length > 0)
      .join('\n');
  }

  // Look for instructions section
  const instructionsStart = lines.findIndex(line => 
    line.toLowerCase().includes('instruction') || 
    line.toLowerCase().includes('direction')
  );
  if (instructionsStart > -1) {
    recipe.instructions = lines
      .slice(instructionsStart + 1)
      .filter(line => line.length > 0)
      .join('\n');
  }

  return recipe;
}

export async function enhanceRecipeData(parsedRecipe: ParsedRecipe): Promise<ParsedRecipe> {
  const enhanced = { ...parsedRecipe };

  // Estimate prep and cook times
  enhanced.prepTime = estimatePrepTime(enhanced.ingredients);
  enhanced.cookTime = estimateCookTime(enhanced.instructions);

  // Set default nutrition if not present
  enhanced.nutrition = {
    calories: estimateCalories(enhanced.ingredients),
    protein: estimateProtein(enhanced.ingredients),
    carbs: estimateCarbs(enhanced.ingredients),
    fat: estimateFat(enhanced.ingredients),
  };

  // Set default author if not present
  if (!enhanced.author) {
    enhanced.author = 'Unknown';
  }

  return enhanced;
}

function estimatePrepTime(ingredients?: string): number {
  if (!ingredients) return 15;
  const ingredientCount = ingredients.split('\n').length;
  return Math.max(10, ingredientCount * 2);
}

function estimateCookTime(instructions?: string): number {
  if (!instructions) return 20;
  const stepCount = instructions.split('\n').length;
  return Math.max(15, stepCount * 5);
}

function estimateCalories(ingredients?: string): number {
  if (!ingredients) return 0;
  const lineCount = ingredients.split('\n').length;
  return lineCount * 100; // Basic estimate
}

function estimateProtein(ingredients?: string): number {
  if (!ingredients) return 0;
  return Math.round(estimateCalories(ingredients) * 0.15 / 4); // 15% of calories from protein
}

function estimateCarbs(ingredients?: string): number {
  if (!ingredients) return 0;
  return Math.round(estimateCalories(ingredients) * 0.5 / 4); // 50% of calories from carbs
}

function estimateFat(ingredients?: string): number {
  if (!ingredients) return 0;
  return Math.round(estimateCalories(ingredients) * 0.35 / 9); // 35% of calories from fat
}
