'use client';

import { Container, SimpleGrid, VStack } from '@chakra-ui/react';
import Title from '@/components/Title';
import RecipeCard from '@/components/RecipeCard';
import { useStore } from '@/store/useRecipeStore';

export default function RecipesPage() {
  const recipes = useStore((state) => state.recipes);

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
