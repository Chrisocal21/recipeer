'use client';

import { Container, VStack, SimpleGrid } from '@chakra-ui/react';
import Title from '@/components/Title';
import RecipeCard from '@/components/RecipeCard';
import { useStore } from '@/store/useRecipeStore';

export default function FavoritesPage() {
  const favorites = useStore(state => state.getFavorites());

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Saved Recipes" />
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {favorites.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
