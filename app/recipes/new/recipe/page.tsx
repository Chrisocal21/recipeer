'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useRecipeStore';
import {
  Container,
  VStack,
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  Button,
  InputGroup,
  InputRightAddon,
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import Title from '@/components/Title';

export default function NewRecipeFormPage() {
  const router = useRouter();
  const addRecipe = useStore(state => state.addRecipe);
  const toast = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      
      const recipe = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        ingredients: formData.get('ingredients') as string,
        instructions: formData.get('instructions') as string,
        originStory: formData.get('originStory') as string,
        chefNotes: formData.get('chefNotes') as string,
        prepTime: Number(formData.get('prepTime')),
        cookTime: Number(formData.get('cookTime')),
        nutrition: {
          calories: Number(formData.get('calories')) || 0,
          protein: Number(formData.get('protein')) || 0,
          carbs: Number(formData.get('carbs')) || 0,
          fat: Number(formData.get('fat')) || 0,
        }
      };
      
      addRecipe(recipe);
      toast({
        title: 'Recipe created successfully',
        status: 'success',
        duration: 2000,
      });
      router.push('/recipes');
    } catch (error) {
      toast({
        title: 'Failed to create recipe',
        status: 'error',
        duration: 2000,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Create New Recipe" />
        
        <Box as="form" bg="gray.800" p={8} borderRadius="xl" shadow="md" onSubmit={handleSubmit}>
          <VStack spacing={8} align="stretch">
            {/* Recipe Title */}
            <FormControl isRequired>
              <FormLabel color="gray.300">Recipe Title</FormLabel>
              <Input 
                name="name"
                placeholder="Give your masterpiece a name! (e.g., 'The Ultimate Comfort Mac & Cheese')" 
                size="lg"
              />
            </FormControl>

            {/* Description */}
            <FormControl isRequired>
              <FormLabel color="gray.300">Description</FormLabel>
              <Textarea
                name="description"
                placeholder="Write a brief description of your recipe..."
                minH="100px"
              />
            </FormControl>

            {/* Nutrition Facts */}
            <FormControl>
              <FormLabel color="gray.300">Nutrition Facts (per serving)</FormLabel>
              <SimpleGrid columns={[2, 4]} spacing={4}>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="calories" placeholder="Calories" />
                  </NumberInput>
                  <InputRightAddon>kcal</InputRightAddon>
                </InputGroup>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="protein" placeholder="Protein" />
                  </NumberInput>
                  <InputRightAddon>g</InputRightAddon>
                </InputGroup>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="carbs" placeholder="Carbs" />
                  </NumberInput>
                  <InputRightAddon>g</InputRightAddon>
                </InputGroup>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="fat" placeholder="Fat" />
                  </NumberInput>
                  <InputRightAddon>g</InputRightAddon>
                </InputGroup>
              </SimpleGrid>
            </FormControl>

            {/* Cooking Times */}
            <FormControl isRequired>
              <FormLabel color="gray.300">Cooking Times</FormLabel>
              <SimpleGrid columns={[2]} spacing={4}>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="prepTime" placeholder="Prep Time" />
                  </NumberInput>
                  <InputRightAddon>mins</InputRightAddon>
                </InputGroup>
                <InputGroup>
                  <NumberInput min={0} w="full">
                    <NumberInputField name="cookTime" placeholder="Cook Time" />
                  </NumberInput>
                  <InputRightAddon>mins</InputRightAddon>
                </InputGroup>
              </SimpleGrid>
            </FormControl>

            <Divider />

            {/* Ingredients */}
            <FormControl isRequired>
              <FormLabel color="gray.300">Ingredients</FormLabel>
              <Textarea
                name="ingredients"
                placeholder="List your ingredients here, one per line:
Example:
2 cups all-purpose flour
1 tsp salt
3 large eggs, room temperature"
                minH="200px"
              />
            </FormControl>

            {/* Instructions */}
            <FormControl isRequired>
              <FormLabel color="gray.300">Step-by-Step Instructions</FormLabel>
              <Textarea
                name="instructions"
                placeholder="Write your instructions step by step:
1. Preheat oven to 350°F
2. Mix dry ingredients in a large bowl
💡 Pro tip: Sifting the flour makes for a lighter texture!
3. Add wet ingredients..."
                minH="300px"
              />
            </FormControl>

            {/* Origin Story */}
            <FormControl>
              <FormLabel color="gray.300">Recipe Origin Story</FormLabel>
              <Textarea
                name="originStory"
                placeholder="Share the story behind this recipe! Where did it come from? What makes it special?"
                minH="100px"
              />
            </FormControl>

            {/* Notes */}
            <FormControl>
              <FormLabel color="gray.300">Chef's Notes</FormLabel>
              <Textarea
                name="chefNotes"
                placeholder="Any final tips, substitutions, or words of encouragement?"
                minH="100px"
              />
            </FormControl>

            <Button 
              type="submit" 
              colorScheme="teal" 
              size="lg"
              mt={4}
            >
              Save Recipe
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
