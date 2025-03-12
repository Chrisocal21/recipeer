'use client';

import { Box, Input, VStack, BoxProps, Button, HStack } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useRecipeStore';

interface NotebookPaperProps extends BoxProps {
  // Add any additional props here
}

export default function NotebookPaper({ ...props }: NotebookPaperProps) {
  const { getGroceryList, updateGroceryList, clearGroceryList } = useStore();
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const savedItems = getGroceryList();
    setItems([...savedItems, ...Array(20 - savedItems.length).fill('')]);
  }, []);

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    const validItems = newItems.filter(Boolean);
    setItems([...validItems, ...Array(20 - validItems.length).fill('')]);
    updateGroceryList(validItems);
  };

  const handleClear = () => {
    setItems(Array(20).fill(''));
    clearGroceryList();
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
      <HStack justify="flex-end" mb={4}>
        <Button
          leftIcon={<DeleteIcon />}
          colorScheme="red"
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          Clear List
        </Button>
      </HStack>
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
