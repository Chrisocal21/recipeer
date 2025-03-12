'use client';

import {
  Container,
  VStack,
  Grid,
  Box,
  Text,
  SimpleGrid,
  Button,
  HStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import Title from '@/components/Title';
import { useStore } from '@/store/useRecipeStore';
import { format, startOfWeek, addDays, isWithinInterval, startOfDay, addWeeks } from 'date-fns';
import { ViewIcon } from '@chakra-ui/icons';
import QRCodeModal from '@/components/QRCodeModal';

export default function MealPlanPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mealPlans] = useState([
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ]);
  const startDate = startOfWeek(selectedDate);
  const weekInterval = {
    start: startDate,
    end: addDays(startDate, 6),
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < 28; i++) {
      const currentDate = addDays(startDate, i);
      const isCurrentWeek = isWithinInterval(currentDate, weekInterval);
      
      days.push(
        <Box
          key={i}
          p={4}
          bg={isCurrentWeek ? 'gray.700' : 'gray.800'}
          borderRadius="lg"
          opacity={isCurrentWeek ? 1 : 0.5}
          cursor={isCurrentWeek ? 'pointer' : 'default'}
          _hover={isCurrentWeek ? { bg: 'gray.600' } : {}}
        >
          <VStack spacing={1}>
            <Text fontSize="sm" color="gray.400">
              {format(currentDate, 'EEE')}
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              {format(currentDate, 'd')}
            </Text>
          </VStack>
        </Box>
      );
    }
    return days;
  };

  const handleQRCode = (planId: string) => {
    setSelectedPlan(planId);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Meal Planning" />
        
        <HStack justify="space-between">
          <Button
            onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
          >
            Previous Week
          </Button>
          <Text fontSize="lg" fontWeight="bold">
            {format(startDate, 'MMMM yyyy')}
          </Text>
          <Button
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
          >
            Next Week
          </Button>
        </HStack>

        <Grid
          templateColumns="repeat(7, 1fr)"
          gap={4}
        >
          {renderCalendarDays()}
        </Grid>

        <Box mt={8}>
          <Title subtitle="My Meal Plans" />
          <SimpleGrid columns={[1, 2, 3]} spacing={6} mt={4}>
            {mealPlans.map((plan) => (
              <Box
                key={plan.id}
                bg="gray.800"
                p={6}
                borderRadius="xl"
              >
                {/* Meal plan cards will go here */}
                <Button
                  leftIcon={<ViewIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQRCode(`mealplan:${plan.id}`)}
                >
                  QR Code
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>

      {selectedPlan && (
        <QRCodeModal
          isOpen={isOpen}
          onClose={onClose}
          title="Scan Meal Plan"
          data={selectedPlan}
        />
      )}
    </Container>
  );
}
