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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { CloseIcon, RepeatIcon, ViewIcon } from '@chakra-ui/icons';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Title from '@/components/Title';
import { Html5Qrcode } from 'html5-qrcode';
import { useStore } from '@/store/useRecipeStore';
import { decodeQRData } from '@/utils/qrcode';

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [qrScanner, setQrScanner] = useState<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();
  const importRecipe = useStore(state => state.importRecipe);

  useEffect(() => {
    if (!isScanning || !scannerRef.current) return;

    const scanner = new Html5Qrcode('qr-reader');
    setQrScanner(scanner);

    scanner.start(
      { facingMode: 'environment' }, // Use back camera
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      handleScanSuccess,
      handleScanError
    ).catch((err) => {
      console.error('Scanner start error:', err);
      toast({
        title: 'Camera access error',
        description: 'Please make sure camera permissions are enabled',
        status: 'error',
      });
      setIsScanning(false);
    });

    return () => {
      if (scanner && scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleScanSuccess = async (decodedText: string) => {
    try {
      if (qrScanner) {
        await qrScanner.stop();
      }
      setIsScanning(false);

      const { type, data } = decodeQRData(decodedText);

      if (type === 'recipe') {
        await importRecipe(data);
        toast({
          title: 'Recipe found!',
          description: `Added "${data.name}" to your collection`,
          status: 'success',
          duration: 3000,
        });
        router.push('/recipes');
      } else if (type === 'mealplan') {
        router.push(`/meal-plan/share/${data}`);
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      toast({
        title: 'Invalid QR Code',
        description: 'This QR code is not from Recipeer',
        status: 'error',
        duration: 3000,
      });
      // Restart scanning after error
      setIsScanning(true);
    }
  };

  const handleScanError = (error: any) => {
    console.warn(error);
  };

  const stopScanner = () => {
    if (qrScanner && qrScanner.isScanning) {
      qrScanner.stop().then(() => {
        setIsScanning(false);
        setQrScanner(null);
      }).catch(console.error);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Scan Recipe or Meal Plan" />
        
        <Box bg="gray.800" p={6} borderRadius="xl">
          {!isScanning ? (
            <VStack spacing={4}>
              <Button 
                onClick={() => setIsScanning(true)} 
                colorScheme="teal" 
                size="lg" 
                leftIcon={<ViewIcon />}
              >
                Start Camera
              </Button>
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                Point your camera at a Recipeer QR code to import recipes or meal plans
              </Alert>
            </VStack>
          ) : (
            <VStack spacing={4}>
              <Box 
                id="qr-reader" 
                ref={scannerRef}
                w="100%"
                maxW="400px"
                h="400px"
                position="relative"
                overflow="hidden"
                borderRadius="lg"
                bg="black"
              />
              <Button
                onClick={stopScanner}
                colorScheme="red"
                size="md"
                leftIcon={<CloseIcon />}
              >
                Stop Scanning
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
}
