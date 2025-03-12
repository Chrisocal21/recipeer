'use client';

import {
  Container,
  VStack,
  Box,
  Button,
  Text,
  useToast,
  Center,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Title from '@/components/Title';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useStore } from '@/store/useRecipeStore';

export default function ScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const router = useRouter();
  const toast = useToast();
  const importRecipe = useStore(state => state.importRecipe);

  useEffect(() => {
    if (!scanning) return;

    const qrScanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
      rememberLastUsedCamera: true,
      aspectRatio: 1,
    }, false);

    setScanner(qrScanner);

    qrScanner.render(handleScanSuccess, handleScanError);

    return () => {
      if (qrScanner) {
        qrScanner.clear();
      }
    };
  }, [scanning]);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      if (decodedText.startsWith('recipe:')) {
        const recipeData = JSON.parse(atob(decodedText.replace('recipe:', '')));
        await importRecipe(recipeData);
        toast({
          title: 'Recipe imported successfully!',
          description: `Added "${recipeData.name}" to your recipes`,
          status: 'success',
          duration: 3000,
        });
        router.push('/recipes');
      } else if (decodedText.startsWith('mealplan:')) {
        // Handle meal plan import
        router.push(`/meal-plan/share/${decodedText.replace('mealplan:', '')}`);
      } else {
        throw new Error('Invalid QR code');
      }
    } catch (error) {
      toast({
        title: 'Invalid QR Code',
        description: 'This QR code is not a valid recipe or meal plan',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleScanError = (error: any) => {
    console.warn(error);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear();
    }
    setScanning(false);
  };

  const restartScanning = () => {
    stopScanning();
    setScanning(true);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Scan Recipe" />
        
        <Box bg="gray.800" p={6} borderRadius="xl">
          {!scanning ? (
            <Button 
              onClick={() => setScanning(true)} 
              colorScheme="teal" 
              size="lg" 
              w="full"
            >
              Start Camera
            </Button>
          ) : (
            <VStack spacing={4}>
              <Box 
                id="reader" 
                bg="black" 
                borderRadius="lg"
                overflow="hidden"
                position="relative"
              />
              <HStack>
                <IconButton
                  aria-label="Stop scanning"
                  icon={<CloseIcon />}
                  onClick={stopScanning}
                  colorScheme="red"
                />
                <IconButton
                  aria-label="Restart scanning"
                  icon={<RepeatIcon />}
                  onClick={restartScanning}
                  colorScheme="blue"
                />
              </HStack>
              <Text color="gray.400" fontSize="sm">
                Position the QR code within the frame
              </Text>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
