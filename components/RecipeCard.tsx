'use client';

import { Box, Heading, Text, VStack, Icon, HStack, Button, useToast, SimpleGrid } from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
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
  const { toggleFavorite } = useStore(state => ({
    toggleFavorite: state.toggleFavorite,
  }));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    toggleFavorite(recipe.id);
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
          <HStack justify="space-between">
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
