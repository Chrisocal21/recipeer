'use client';

import { Box, Input, VStack, BoxProps } from '@chakra-ui/react';
import React, { useState } from 'react';

interface NotebookPaperProps extends BoxProps {
  // Add any additional props here
}

export default function NotebookPaper({ ...props }: NotebookPaperProps) {
  const [items, setItems] = useState<string[]>(Array(20).fill(''));

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="md"
      boxShadow="lg"
      position="relative"
      {...props}
    >
      <VStack spacing={4}>
        {items.map((item, index) => (
          <Box
            key={index}
            w="100%"
            position="relative"
            _after={{
              content: '""',
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '1px',
              bg: 'blue.100'
            }}
          >
            <Input
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              variant="unstyled"
              pl={4}
              placeholder="Add item..."
              color="gray.700"
              fontSize="md"
              h="40px"
              _focus={{
                bg: 'blue.50'
              }}
            />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
