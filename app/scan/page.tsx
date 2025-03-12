'use client';

import { Container, VStack, Box, Button, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Title from '@/components/Title';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanPage() {
  const router = useRouter();
  const toast = useToast();
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    scanner.render(success, error);

    function success(result: string) {
      scanner.clear();
      setScanning(false);
      
      // Handle the scanned QR code
      if (result.includes('recipe:')) {
        router.push(`/recipes/share/${result.split('recipe:')[1]}`);
      } else if (result.includes('mealplan:')) {
        router.push(`/meal-plan/share/${result.split('mealplan:')[1]}`);
      } else {
        toast({
          title: 'Invalid QR Code',
          status: 'error',
          duration: 3000,
        });
      }
    }

    function error(err: any) {
      console.warn(err);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanning, router, toast]);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Title subtitle="Scan Recipe" />
        
        <Box bg="gray.800" p={6} borderRadius="xl">
          {!scanning ? (
            <Button onClick={() => setScanning(true)} colorScheme="teal" size="lg" w="full">
              Start Scanning
            </Button>
          ) : (
            <Box id="reader" />
          )}
        </Box>
      </VStack>
    </Container>
  );
}
