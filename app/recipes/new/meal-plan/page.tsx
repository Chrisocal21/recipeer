'use client';

import {
  Container,
  VStack,
  Box,
  Button,
  Text,
  SimpleGrid,
  Select,
  useToast,
  HStack,
  Grid,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, CalendarIcon, DeleteIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Title from '@/components/Title';
import { useStore } from '@/store/useRecipeStore';
import { format, addDays, startOfWeek, addWeeks, isWithinInterval } from 'date-fns';

export default function NewMealPlanPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const recipes = useStore(state => state.recipes);
  const { addMealPlan, updateGroceryList } = useStore();

  const handleAddToGroceryList = (recipeIds: number[]) => {
    const selectedRecipes = recipes.filter(recipe => recipeIds.includes(recipe.id));
    const groceryItems = selectedRecipes.flatMap(recipe => 
      recipe.ingredients.split('\n')
        .map(ingredient => `[${recipe.name}] ${ingredient.trim()}`)
        .filter(Boolean)
    );

    updateGroceryList(groceryItems);
    toast({
      title: 'Added to grocery list',
      status: 'success',
    });
  };

  const handleAddMeal = (recipeId: number) => {
    if (!selectedMealType) {
      toast({
        title: 'Please select a meal type',
        status: 'warning',
      });
      return;
    }

    addMealPlan({
      date: selectedDate.toISOString(),
      recipeId,
      mealType: selectedMealType as any,
    });

    toast({
      title: 'Meal added to plan',
      status: 'success',
    });
    onClose();
  };

  const renderCalendarDays = () => {
    const startDate = startOfWeek(selectedDate);
    const weekInterval = {
      start: startDate,
      end: addDays(startDate, 6),
    };
    const days = [];
    for (let i = 0; i < 28; i++) {
      const currentDate = addDays(startDate, i);
      const isCurrentWeek = isWithinInterval(currentDate, weekInterval);
      
      days.push(
        <Box
          key={i}
          p={{ base: 2, md: 4 }}
          bg={isCurrentWeek ? 'gray.700' : 'gray.800'}
          borderRadius="lg"
          opacity={isCurrentWeek ? 1 : 0.5}
          cursor={isCurrentWeek ? 'pointer' : 'default'}
          _hover={isCurrentWeek ? { bg: 'gray.600' } : {}}
          onClick={() => {
            if (isCurrentWeek) {
              setSelectedDate(currentDate);
              onOpen();
            }
          }}
        >
          <VStack spacing={1}>
            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.400">
              {format(currentDate, 'EEE')}
            </Text>
            <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="white">
              {format(currentDate, 'd')}
            </Text>
            <VStack
              spacing={1}
              w="full"
              minH={{ base: "60px", md: "80px" }}
            >
              {['breakfast', 'lunch', 'dinner'].map((type) => (
                <Box
                  key={type}
                  w="full"
                  p={1}
                  bg="gray.800"
                  borderRadius="sm"
                  textAlign="center"
                  fontSize="xs"
                  color="gray.400"
                >
                  {type[0].toUpperCase()}
                </Box>
              ))}
            </VStack>
          </VStack>
        </Box>
      );
    }
    return days;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={{ base: 4, md: 8 }} align="stretch">
        <Title subtitle="Create New Meal Plan" />
        
        <HStack justify="space-between" wrap={{ base: "wrap", md: "nowrap" }}>
          <Button
            size={{ base: "sm", md: "md" }}
            onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
            w={{ base: "full", md: "auto" }}
            mb={{ base: 2, md: 0 }}
            leftIcon={<ChevronLeftIcon />}
          >
            Previous Week
          </Button>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" textAlign="center">
            {format(startOfWeek(selectedDate), 'MMMM yyyy')}
          </Text>
          <Button
            size={{ base: "sm", md: "md" }}
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
            w={{ base: "full", md: "auto" }}
            rightIcon={<ChevronRightIcon />}
          >
            Next Week
          </Button>
        </HStack>

        <Grid
          templateColumns={{ 
            base: "repeat(4, 1fr)", 
            md: "repeat(7, 1fr)" 
          }}
          gap={{ base: 2, md: 4 }}
        >
          {renderCalendarDays()}
        </Grid>

        {/* Quick Actions */}
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          <Button
            leftIcon={<AddIcon />}
            onClick={() => router.push('/recipes/new')}
            colorScheme="teal"
          >
            Add New Recipe
          </Button>
          <Button
            leftIcon={<CalendarIcon />}
            onClick={() => handleAddToGroceryList(recipes.map(r => r.id))}
            colorScheme="purple"
          >
            Generate Shopping List
          </Button>
          <Button
            leftIcon={<CalendarIcon />}
            onClick={() => router.push('/meal-plan')}
            variant="outline"
          >
            View All Plans
          </Button>
        </SimpleGrid>

        {/* Recipe Selection Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent bg="gray.800">
            <ModalHeader color="white">Select Recipe</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <Select
                  placeholder="Select meal type"
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </Select>

                <SimpleGrid columns={[1, 2]} spacing={4}>
                  {recipes.map(recipe => (
                    <Box
                      key={recipe.id}
                      p={4}
                      bg="gray.700"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => handleAddMeal(recipe.id)}
                      _hover={{ bg: 'gray.600' }}
                    >
                      <Text fontWeight="bold" color="white">{recipe.name}</Text>
                      <Text color="gray.300" fontSize="sm">{recipe.description}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
