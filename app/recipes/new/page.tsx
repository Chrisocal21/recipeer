'use client';

import { Container, VStack, SimpleGrid, Box, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { EditIcon, CalendarIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import Title from '@/components/Title';

export default function NewRecipePage() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="What would you like to create?" />
        
        <SimpleGrid columns={[1, null, 2]} spacing={6}>
          <Link href="/recipes/new/recipe" style={{ textDecoration: 'none' }}>
            <Box
              p={8}
              bg="gray.800"
              borderRadius="xl"
              _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
              transition="all 0.2s"
            >
              <VStack spacing={4} align="start">
                <Icon as={EditIcon} w={8} h={8} color="orange.400" />
                <Heading size="md" color="white">Create New Recipe</Heading>
                <Text color="gray.400">
                  Create a new recipe from scratch. Add ingredients, steps, cooking times, and more.
                  Perfect for documenting your culinary creations or family recipes.
                </Text>
              </VStack>
            </Box>
          </Link>

          <Link href="/recipes/new/meal-plan" style={{ textDecoration: 'none' }}>
            <Box
              p={8}
              bg="gray.800"
              borderRadius="xl"
              _hover={{ transform: 'translateY(-4px)', shadow: 'xl' }}
              transition="all 0.2s"
            >
              <VStack spacing={4} align="start">
                <Icon as={CalendarIcon} w={8} h={8} color="blue.400" />
                <Heading size="md" color="white">Create Meal Plan</Heading>
                <Text color="gray.400">
                  Plan your meals for the week. Choose from your saved recipes,
                  organize by day, and generate shopping lists automatically.
                </Text>
              </VStack>
            </Box>
          </Link>
        </SimpleGrid>

        <Box mt={6} p={6} bg="gray.800" borderRadius="xl">
          <VStack spacing={4}>
            <Heading size="sm" color="gray.300">Quick Tips</Heading>
            <Text color="gray.400" fontSize="sm">
              • Creating a recipe? Have your ingredients and steps ready
            </Text>
            <Text color="gray.400" fontSize="sm">
              • Planning meals? Make sure you've saved your favorite recipes first
            </Text>
            <Text color="gray.400" fontSize="sm">
              • Both options will help you generate shopping lists automatically
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
