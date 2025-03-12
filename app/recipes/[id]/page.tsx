'use client';

import {
  Container,
  VStack,
  Box,
  Heading,
  Text,
  SimpleGrid,
  Divider,
  HStack,
  Icon,
  Button,
} from '@chakra-ui/react';
import { TimeIcon, StarIcon } from '@chakra-ui/icons';
import Title from '@/components/Title';
import { useStore } from '@/store/useRecipeStore';

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = useStore(state => 
    state.recipes.find(r => r.id === parseInt(params.id))
  );
  const toggleFavorite = useStore(state => state.toggleFavorite);

  if (!recipe) {
    return (
      <Container maxW="container.xl" py={8}>
        <Title subtitle="Recipe not found" />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle={recipe.name} />
        
        <Box bg="gray.800" p={8} borderRadius="xl" shadow="md">
          <VStack spacing={6} align="stretch">
            {/* Header with favorite button */}
            <HStack justify="space-between">
              <Box>
                <Text color="gray.400" fontSize="sm">Recipe by Chef</Text>
              </Box>
              <Button
                leftIcon={<StarIcon />}
                variant="ghost"
                colorScheme={recipe.isFavorite ? "yellow" : "gray"}
                onClick={() => toggleFavorite(recipe.id)}
              >
                {recipe.isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            </HStack>

            <Divider />

            {/* Cooking Times */}
            <SimpleGrid columns={[2, 4]} spacing={6}>
              <Box>
                <Text color="gray.400" fontSize="sm">Prep Time</Text>
                <HStack color="white">
                  <Icon as={TimeIcon} />
                  <Text>{recipe.prepTime} mins</Text>
                </HStack>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm">Cook Time</Text>
                <HStack color="white">
                  <Icon as={TimeIcon} />
                  <Text>{recipe.cookTime} mins</Text>
                </HStack>
              </Box>
              <Box>
                <Text color="gray.400" fontSize="sm">Total Time</Text>
                <HStack color="white">
                  <Icon as={TimeIcon} />
                  <Text>{recipe.prepTime + recipe.cookTime} mins</Text>
                </HStack>
              </Box>
            </SimpleGrid>

            {/* Nutrition Facts */}
            <Box>
              <Heading size="md" color="white" mb={4}>Nutrition Facts</Heading>
              <SimpleGrid columns={[2, 4]} spacing={6}>
                <Box>
                  <Text color="gray.400" fontSize="sm">Calories</Text>
                  <Text color="white">{recipe.nutrition.calories} kcal</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Protein</Text>
                  <Text color="white">{recipe.nutrition.protein}g</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Carbs</Text>
                  <Text color="white">{recipe.nutrition.carbs}g</Text>
                </Box>
                <Box>
                  <Text color="gray.400" fontSize="sm">Fat</Text>
                  <Text color="white">{recipe.nutrition.fat}g</Text>
                </Box>
              </SimpleGrid>
            </Box>

            <Divider />

            {/* Ingredients */}
            <Box>
              <Heading size="md" color="white" mb={4}>Ingredients</Heading>
              <Text color="gray.300" whiteSpace="pre-line">
                {recipe.ingredients}
              </Text>
            </Box>

            {/* Instructions */}
            <Box>
              <Heading size="md" color="white" mb={4}>Instructions</Heading>
              <Text color="gray.300" whiteSpace="pre-line">
                {recipe.instructions}
              </Text>
            </Box>

            {recipe.originStory && (
              <Box>
                <Heading size="md" color="white" mb={4}>Origin Story</Heading>
                <Text color="gray.300">{recipe.originStory}</Text>
              </Box>
            )}

            {recipe.chefNotes && (
              <Box>
                <Heading size="md" color="white" mb={4}>Chef's Notes</Heading>
                <Text color="gray.300">{recipe.chefNotes}</Text>
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
