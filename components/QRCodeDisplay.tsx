'use client';

import { Box, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { generateQRCode } from '@/utils/qrcode';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

export default function QRCodeDisplay({ data, size = 200 }: QRCodeDisplayProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    generateQRCode(data)
      .then(setQrUrl)
      .catch(() => setError(true));
  }, [data]);

  if (error) return null;
  if (!qrUrl) return null;

  return (
    <Box 
      bg="white" 
      p={2} 
      borderRadius="md" 
      width={`${size}px`} 
      height={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Image 
        src={qrUrl} 
        alt="QR Code" 
        width={size - 16} 
        height={size - 16}
        style={{ objectFit: 'contain' }}
      />
    </Box>
  );
}
