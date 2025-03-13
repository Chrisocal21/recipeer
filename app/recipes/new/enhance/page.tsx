'use client';

import {
  Container,
  VStack,
  Box,
  Button,
  Text,
  useToast,
  Input,
  Tag,
  Wrap,
  WrapItem,
  SimpleGrid,
  Checkbox,
  Heading,
  HStack,
  IconButton,
  TagCloseButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Title from '@/components/Title';
import { useStore, Recipe } from '@/store/useRecipeStore';
import { StarIcon, AddIcon } from '@chakra-ui/icons';
import { generateRecipes } from '@/utils/recipeAI';

export default function EnhancePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [suggestedRecipes, setSuggestedRecipes] = useState<Partial<Recipe>[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const addRecipe = useStore(state => state.addRecipe);

  const handleAddIngredient = () => {
    if (currentInput.trim()) {
      setIngredients([...ingredients, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerateRecipes = async () => {
    if (ingredients.length < 3) {
      toast({
        title: 'Not enough ingredients',
        description: 'Please add at least 3 ingredients',
        status: 'warning'
      });
      return;
    }

    setIsLoading(true);
    try {
      const generatedRecipes = await generateRecipes(ingredients);
      setSuggestedRecipes(generatedRecipes);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: 'Error generating recipes',
        description: 'Could not generate recipes at this time',
        status: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSelected = () => {
    selectedRecipes.forEach(index => {
      const recipe = suggestedRecipes[index] as Recipe;
      addRecipe({
        ...recipe,
        author: 'AI Generated',
        ingredients: recipe.ingredients || '',
        instructions: recipe.instructions || '',
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        nutrition: recipe.nutrition || {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        },
      });
    });

    toast({
      title: 'Recipes added successfully',
      status: 'success'
    });
    router.push('/recipes');
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="AI Recipe Enhancement" />

        <Box bg="gray.800" p={6} borderRadius="xl">
          <VStack spacing={4}>
            <HStack w="full">
              <Input
                placeholder="Enter an ingredient..."
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
              />
              <IconButton
                aria-label="Add ingredient"
                icon={<AddIcon />}
                onClick={handleAddIngredient}
              />
            </HStack>

            <Wrap spacing={2}>
              {ingredients.map((ing, index) => (
                <WrapItem key={index}>
                  <Tag
                    size="lg"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="teal"
                  >
                    {ing}
                    <TagCloseButton onClick={() => handleRemoveIngredient(index)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>

            <Button
              leftIcon={<StarIcon />}
              colorScheme="purple"
              isLoading={isLoading}
              onClick={handleGenerateRecipes}
              isDisabled={ingredients.length < 3}
            >
              Generate Recipes
            </Button>
          </VStack>
        </Box>

        {suggestedRecipes.length > 0 && (
          <VStack spacing={4}>
            <Heading size="md" color="white">Suggested Recipes</Heading>
            <SimpleGrid columns={[1, 2, 3]} spacing={6}>
              {suggestedRecipes.map((recipe, index) => (
                <Box
                  key={index}
                  bg="gray.700"
                  p={4}
                  borderRadius="lg"
                  opacity={selectedRecipes.includes(index) ? 1 : 0.7}
                >
                  <Checkbox
                    isChecked={selectedRecipes.includes(index)}
                    onChange={(e) => {
                      setSelectedRecipes(
                        e.target.checked
                          ? [...selectedRecipes, index]
                          : selectedRecipes.filter(i => i !== index)
                      );
                    }}
                  >
                    <Text color="white" fontWeight="bold">{recipe.name}</Text>
                  </Checkbox>
                  <Text color="gray.300" fontSize="sm" mt={2}>
                    {recipe.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            <Button
              colorScheme="teal"
              size="lg"
              onClick={handleSaveSelected}
              isDisabled={selectedRecipes.length === 0}
            >
              Add Selected Recipes
            </Button>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
