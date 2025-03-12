'use client';

import { Box, Heading, Text, VStack, Icon, HStack, Button, useToast } from '@chakra-ui/react';
import { StarIcon, TimeIcon, DeleteIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useStore } from '@/store/useRecipeStore';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const toast = useToast();
  const { toggleFavorite, deleteRecipe } = useStore(state => ({
    toggleFavorite: state.toggleFavorite,
    deleteRecipe: state.deleteRecipe
  }));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    toggleFavorite(recipe.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        deleteRecipe(recipe.id);
        toast({
          title: 'Recipe deleted',
          status: 'success',
          duration: 2000,
        });
      } catch (error) {
        toast({
          title: 'Failed to delete recipe',
          status: 'error',
          duration: 2000,
        });
      }
    }
  };

  return (
    <Link 
      href={{
        pathname: `/recipes/${recipe.id}`,
        query: { name: recipe.name }
      }} 
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
        <VStack align="start" spacing={3}>
          <Heading size="md" color="white">{recipe.name}</Heading>
          <Text color="gray.400" noOfLines={2}>{recipe.description}</Text>
          <HStack spacing={4} width="100%" justify="space-between">
            <HStack 
              as="button"
              onClick={handleFavoriteClick}
              color={recipe.isFavorite ? "yellow.400" : "gray.400"}
              _hover={{ color: "yellow.300" }}
            >
              <Icon as={StarIcon} />
              <Text fontSize="sm">{recipe.isFavorite ? 'Favorited' : 'Add to Favorites'}</Text>
            </HStack>
            <HStack color="blue.400">
              <Icon as={TimeIcon} />
              <Text fontSize="sm">30 min</Text>
            </HStack>
            <Button
              leftIcon={<DeleteIcon />}
              variant="ghost"
              colorScheme="red"
              size="sm"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
