import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: string;
  instructions: string;
  originStory?: string;
  chefNotes?: string;
  prepTime: number;
  cookTime: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  isFavorite: boolean;
  author: string;
  shareId?: string;
  generated?: boolean;
  lastModified: number;
  rating?: number;
  reviews?: string[];
  servings?: number;
}

interface MealPlan {
  id: number;
  date: string;
  recipeId: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

interface GroceryList {
  id: number;
  items: string[];
  created: number;
}

interface UserStore {
  recipes: Recipe[];
  mealPlans: MealPlan[];
  groceryLists: GroceryList[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'isFavorite'>) => void;
  toggleFavorite: (id: number) => void;
  getFavorites: () => Recipe[];
  addMealPlan: (mealPlan: Omit<MealPlan, 'id'>) => void;
  removeMealPlan: (id: number) => void;
  updateGroceryList: (items: string[]) => void;
  getGroceryList: () => string[];
  deleteRecipe: (id: number) => void;
  clearGroceryList: () => void;
  shareRecipe: (id: number) => string;
  importRecipe: (sharedRecipe: Omit<Recipe, 'id' | 'isFavorite'>) => void;
  rateRecipe: (id: number, rating: number, review?: string) => void;
  scaleRecipe: (id: number, servings: number) => Recipe;
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      recipes: [],
      mealPlans: [],
      groceryLists: [],
      addRecipe: (recipe) => set((state) => ({
        recipes: [...state.recipes, {
          ...recipe,
          id: Date.now(),
          isFavorite: false,
          lastModified: Date.now(),
          generated: recipe.generated || false
        }]
      })),
      toggleFavorite: (id) => set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
        )
      })),
      getFavorites: () => get().recipes.filter(recipe => recipe.isFavorite),
      addMealPlan: (mealPlan) => set((state) => ({
        mealPlans: [...state.mealPlans, { ...mealPlan, id: Date.now() }]
      })),
      removeMealPlan: (id) => set((state) => ({
        mealPlans: state.mealPlans.filter(mp => mp.id !== id)
      })),
      updateGroceryList: (items) => set((state) => ({
        groceryLists: [
          ...state.groceryLists,
          { id: Date.now(), items, created: Date.now() }
        ].slice(-10) // Keep only last 10 lists
      })),
      getGroceryList: () => {
        const lists = get().groceryLists;
        return lists.length > 0 ? lists[lists.length - 1].items : [];
      },
      deleteRecipe: (id) => set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        mealPlans: state.mealPlans.filter(mp => mp.recipeId !== id),
        groceryLists: state.groceryLists.map(list => ({
          ...list,
          items: list.items.filter(item => !item.startsWith(`[Recipe ${id}]`))
        }))
      })),
      clearGroceryList: () => set((state) => ({
        groceryLists: []
      })),
      shareRecipe: (id) => {
        const recipe = get().recipes.find(r => r.id === id);
        if (!recipe) return '';
        const { id: _id, isFavorite: _fav, ...shareableRecipe } = recipe;
        return btoa(JSON.stringify(shareableRecipe));
      },
      importRecipe: (sharedRecipe) => {
        if (!sharedRecipe.name || !sharedRecipe.author) return;
        set((state) => ({
          recipes: [...state.recipes, {
            ...sharedRecipe,
            id: Date.now(),
            isFavorite: false,
          }]
        }));
      },
      rateRecipe: (id, rating, review) => set(state => ({
        recipes: state.recipes.map(recipe => 
          recipe.id === id 
            ? { 
                ...recipe, 
                rating: rating,
                reviews: review ? [...(recipe.reviews || []), review] : recipe.reviews
              }
            : recipe
        )
      })),
      scaleRecipe: (id, newServings) => {
        const recipe = get().recipes.find(r => r.id === id);
        if (!recipe || !recipe.servings) throw new Error('Recipe not found or servings not specified');
        
        const scaleFactor = newServings / recipe.servings;
        return {
          ...recipe,
          servings: newServings,
          ingredients: recipe.ingredients
            .split('\n')
            .map(line => {
              const match = line.match(/^([\d.]+)/);
              if (match) {
                const num = parseFloat(match[1]);
                return line.replace(/^[\d.]+/, (num * scaleFactor).toFixed(1));
              }
              return line;
            })
            .join('\n')
        };
      },
    }),
    {
      name: 'user-storage',
      version: 1,
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      },
    }
  )
);
