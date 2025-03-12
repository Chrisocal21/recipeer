'use client';

import { Container, SimpleGrid, VStack } from '@chakra-ui/react';
import Title from '@/components/Title';
import RecipeCard from '@/components/RecipeCard';
import { useEffect, useState } from 'react';

interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // Placeholder for API call
    setRecipes([
      { id: 1, name: 'Pasta Carbonara', description: 'Classic Italian pasta dish' },
      { id: 2, name: 'Chicken Curry', description: 'Spicy chicken curry' },
    ]);
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Browse Recipes" />
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
