'use client';

import { Box, Heading, Text, VStack, Icon, HStack, Button, useToast, SimpleGrid, IconButton } from '@chakra-ui/react';
import { StarIcon, TimeIcon, DeleteIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useStore } from '@/store/useRecipeStore';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  isFavorite?: boolean;
  rating?: number;
  reviews?: number[];
}

export interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const toast = useToast();
  const { toggleFavorite, deleteRecipe } = useStore(state => ({
    toggleFavorite: state.toggleFavorite,
    deleteRecipe: state.deleteRecipe,
  }));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    toggleFavorite(recipe.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe(recipe.id);
      toast({
        title: 'Recipe deleted',
        status: 'success',
        duration: 2000,
      });
    }
  };

  return (
    <Link 
      href={`/recipes/${recipe.id}`}
      style={{ textDecoration: 'none' }}
    >
      <Box
        bg="gray.800"
        p={6}
        borderRadius="xl"
        transition="all 0.2s"
        _hover={{
          transform: 'translateY(-4px)',
          shadow: 'xl',
        }}
      >
        <VStack align="stretch" spacing={3}>
          <Heading size="md" color="white" noOfLines={1}>{recipe.name}</Heading>
          <Text color="gray.400" noOfLines={2}>{recipe.description}</Text>
          {recipe.rating && (
            <HStack spacing={1}>
              {Array(5).fill('').map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < recipe.rating! ? "yellow.400" : "gray.300"}
                  w={3}
                  h={3}
                />
              ))}
              <Text fontSize="sm" color="gray.400">
                ({recipe.reviews?.length || 0})
              </Text>
            </HStack>
          )}
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteClick}
                color={recipe.isFavorite ? "yellow.400" : "gray.400"}
                _hover={{ color: "yellow.300" }}
                leftIcon={<StarIcon />}
              >
                {recipe.isFavorite ? 'Saved' : 'Save'}
              </Button>
              <IconButton
                aria-label="Delete recipe"
                icon={<DeleteIcon />}
                variant="ghost"
                size="sm"
                colorScheme="red"
                onClick={handleDelete}
              />
            </HStack>
            <HStack color="blue.400">
              <Icon as={TimeIcon} />
              <Text fontSize="sm">30 minutes</Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
