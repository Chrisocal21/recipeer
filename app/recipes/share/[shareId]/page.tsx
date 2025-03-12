'use client';

import {
  Container,
  VStack,
  Button,
  Text,
  useToast,
  Box,
  Heading,
  SimpleGrid,
  Icon,
  HStack,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useRecipeStore';
import { useState, useEffect } from 'react';
import Title from '@/components/Title';

export default function SharedRecipePage({ params }: { params: { shareId: string } }) {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    try {
      const decoded = JSON.parse(atob(params.shareId));
      if (!decoded.name || !decoded.author) throw new Error('Invalid recipe data');
      setRecipe(decoded);
    } catch (error) {
      toast({
        title: 'Invalid recipe link',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [params.shareId, toast]);

  const handleImport = () => {
    try {
      useStore.getState().importRecipe(recipe);
      toast({
        title: 'Recipe added to your collection',
        description: `${recipe.name} by ${recipe.author} has been imported`,
        status: 'success',
        duration: 4000,
      });
      router.push('/recipes');
    } catch (error) {
      toast({
        title: 'Failed to import recipe',
        description: 'Please try again later',
        status: 'error',
        duration: 4000,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading recipe...</Text>
        </VStack>
      </Container>
    );
  }

  if (!recipe) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Title subtitle="Invalid Recipe Link" />
          <Button colorScheme="teal" onClick={() => router.push('/recipes')}>
            Go to Recipes
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6}>
        <Title subtitle="Shared Recipe" />
        <Box bg="gray.800" p={6} borderRadius="xl" w="full">
          <VStack align="stretch" spacing={4}>
            <Heading size="lg" color="white">{recipe.name}</Heading>
            <Text color="gray.400">by {recipe.author}</Text>
            <Text color="gray.300">{recipe.description}</Text>

            <Divider />

            <SimpleGrid columns={[2, 3]} spacing={4}>
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
            </SimpleGrid>
          </VStack>
        </Box>

        <Button
          colorScheme="teal"
          size="lg"
          onClick={handleImport}
          width={["full", "auto"]}
        >
          Add to My Recipes
        </Button>
      </VStack>
    </Container>
  );
}
