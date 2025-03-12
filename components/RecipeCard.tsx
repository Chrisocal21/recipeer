'use client';

import { Box, Heading, Text, VStack, Icon, HStack } from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export interface Recipe {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.id}`} style={{ textDecoration: 'none' }}>
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
          <HStack spacing={4}>
            <HStack color="yellow.400">
              <Icon as={StarIcon} />
              <Text fontSize="sm">Add to Favorites</Text>
            </HStack>
            <HStack color="blue.400">
              <Icon as={TimeIcon} />
              <Text fontSize="sm">30 min</Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Link>
  );
}
