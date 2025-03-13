'use client';

import { useRouter } from 'next/navigation';
export interface Recipe {
    name: string;
    description: string;
    ingredients: string;
    instructions: string;
    originStory?: string;
    chefNotes?: string;
    prepTime: number;
    cookTime: number;
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    author: string;
}
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
  HStack,
  Text,
} from '@chakra-ui/react';
import { AttachmentIcon, DownloadIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { FaGoogle, FaDropbox } from 'react-icons/fa';
import Title from '@/components/Title';
import { useState, useRef } from 'react';

export default function NewRecipeFormPage() {
  const router = useRouter();
  const addRecipe = useStore(state => state.addRecipe);
  const toast = useToast();
  const [formData, setFormData] = useState<Partial<Recipe>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseRecipeText = (text: string): Partial<Recipe> => {
    // Basic implementation - you can enhance this based on your needs
    return {
      name: '',
      description: text,
      ingredients: '',
      instructions: '',
    };
  };
  
  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setIsProcessing(true);
      try {
        const text = await file.text();
        const recipeData = parseRecipeText(text);
        setFormData(recipeData);
      toast({
        title: 'Recipe imported successfully',
        status: 'success',
      });
    } catch (error) {
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Could not process file',
        status: 'error',
      });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGoogleImport = async () => {
    // Google Drive Picker API implementation
    toast({
      title: 'Google Docs import coming soon',
      status: 'info',
    });
  };

  const handleDropboxImport = async () => {
    // Dropbox Chooser API implementation
    toast({
      title: 'Dropbox import coming soon',
      status: 'info',
    });
  };

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
        },
        author: formData.get('author') as string,
        lastModified: new Date().getTime(),
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
        
        {/* Update Import Section */}
        <Box bg="gray.700" p={4} borderRadius="xl">
          <VStack spacing={4}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full">
              <HStack w="full">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileImport}
                  accept=".txt,.doc,.docx,.rtf,.gdoc"
                  style={{ display: 'none' }}
                />
                <Button
                  leftIcon={<AttachmentIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  isLoading={isProcessing}
                  loadingText="Processing..."
                  colorScheme="purple"
                  w="full"
                  size={{ base: "md", md: "lg" }}
                >
                  <Text noOfLines={1}>
                    Import Local File
                  </Text>
                </Button>
              </HStack>

              <Button
                leftIcon={<FaGoogle />}
                onClick={handleGoogleImport}
                colorScheme="red"
                w="full"
                size={{ base: "md", md: "lg" }}
              >
                <Text noOfLines={1}>
                  Import from Google
                </Text>
              </Button>

              <Button
                leftIcon={<FaDropbox />}
                onClick={handleDropboxImport}
                colorScheme="blue"
                w="full"
                size={{ base: "md", md: "lg" }}
              >
                <Text noOfLines={1}>
                  Import from Dropbox
                </Text>
              </Button>
            </SimpleGrid>

            <Text color="gray.400" fontSize="sm" textAlign="center">
              Supported formats: Text, Word, Google Docs
            </Text>
          </VStack>
        </Box>

        <Box as="form" bg="gray.800" p={8} borderRadius="xl" shadow="md" onSubmit={handleSubmit}>
          <VStack spacing={8} align="stretch">
            <FormControl isRequired>
              <FormLabel color="gray.300">Author</FormLabel>
              <Input
                name="author"
                placeholder="Your name or username"
                size="lg"
              />
            </FormControl>

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
