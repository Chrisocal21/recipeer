'use client';

import {
  Box, Input, VStack, Button, HStack, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  Checkbox, Text, Divider, IconButton, Heading, BoxProps,
  Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay
} from '@chakra-ui/react';
import { DeleteIcon, ChevronRightIcon, AddIcon, EditIcon, SettingsIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useRecipeStore';

interface NotebookPaperProps extends BoxProps {
  // Add any additional props here
}

interface GroupedItems {
  [key: string]: string[];
}

export default function NotebookPaper({ ...props }: NotebookPaperProps) {
  const { getGroceryList, updateGroceryList, clearGroceryList } = useStore();
  const [items, setItems] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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

  const handleAddManualItem = (value: string) => {
    if (!value.trim()) return;
    const newItems = [...items];
    newItems.push(`[Other Items] ${value.trim()}`);
    setItems(newItems);
    updateGroceryList(newItems.filter(Boolean));
  };

  const handleAddNewList = () => {
    const listName = prompt('Enter a name for your new list:');
    if (listName) {
      updateGroceryList([`[${listName}] `]);
    }
  };

  const handleEditList = (title: string) => {
    const newName = prompt('Enter a new name for this list:', title);
    if (newName && newName !== title) {
      const newItems = items.map(item => 
        item.startsWith(`[${title}]`) ? item.replace(`[${title}]`, `[${newName}]`) : item
      );
      setItems(newItems);
      updateGroceryList(newItems);
    }
  };

  // Group items by recipe and filter out "Other Items"
  const groupedItems: GroupedItems = items.reduce((acc: GroupedItems, item) => {
    const match = item.match(/\[(.*?)\]/);
    const group = match ? match[1] : '';
    if (group && group !== 'Other Items') {
      if (!acc[group]) acc[group] = [];
      acc[group].push(item.replace(/\[.*?\]\s*/, ''));
    }
    return acc;
  }, {});

  const handleItemClick = (title: string, groupItems: string[]) => {
    setSelectedTitle(title);
    setSelectedGroup(groupItems);
    onOpen();
  };

  const handleCheckItem = (index: number) => {
    const newGroup = [...selectedGroup];
    newGroup[index] = newGroup[index].startsWith('✓ ') 
      ? newGroup[index].substring(2)
      : '✓ ' + newGroup[index];
    setSelectedGroup(newGroup);
    
    // Update main list
    const newItems = [...items];
    const groupIndex = items.findIndex(item => item.includes(`[${selectedTitle}]`));
    newItems[groupIndex] = `[${selectedTitle}] ${newGroup.join(', ')}`;
    setItems(newItems);
    updateGroceryList(newItems);
  };

  const handleDeleteGroup = (title: string) => {
    const newItems = items.filter(item => !item.includes(`[${title}]`));
    setItems(newItems);
    updateGroceryList(newItems);
    onClose();
  };

  return (
    <Box {...props}>
      <VStack spacing={4}>
        <HStack w="100%" justify="space-between">
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<SettingsIcon />}
              variant="ghost"
              colorScheme="gray"
            />
            <MenuList>
              <MenuItem icon={<AddIcon />} onClick={handleAddNewList}>
                Create New List
              </MenuItem>
              <MenuDivider />
              {Object.keys(groupedItems).map(title => (
                <MenuItem
                  key={title}
                  icon={<EditIcon />}
                  onClick={() => handleEditList(title)}
                >
                  Edit "{title}"
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            variant="ghost"
            size="sm"
            onClick={onAlertOpen}
          >
            Clear All
          </Button>
        </HStack>

        {/* Add Item Section */}
        <Box w="100%">
          <HStack mb={2}>
            <Heading size="sm" color="gray.600">Add Item</Heading>
          </HStack>
          <HStack>
            <Input
              placeholder="Add an item to your list..."
              bg="white"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddManualItem((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <IconButton
              aria-label="Add item"
              icon={<AddIcon />}
              colorScheme="teal"
              onClick={(e) => {
                const input = e.currentTarget.previousSibling as HTMLInputElement;
                handleAddManualItem(input.value);
                input.value = '';
              }}
            />
          </HStack>
        </Box>

        <Divider />

        {/* Recipe Groups */}
        {Object.entries(groupedItems)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([title, groupItems]) => (
            <Box
              key={title}
              w="100%"
              p={3}
              bg="white"
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleItemClick(title, groupItems)}
              _hover={{ bg: 'gray.50' }}
            >
              <HStack justify="space-between">
                <Text fontWeight="bold" color="gray.700">
                  {title} ({groupItems.length})
                </Text>
                <ChevronRightIcon />
              </HStack>
              <Text color="gray.600" noOfLines={1}>
                {groupItems.map(item => item.replace('✓ ', '')).join(', ')}
              </Text>
            </Box>
          ))}

        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent bg="white">
            <ModalHeader>
              <HStack justify="space-between" align="center">
                <Text color="gray.700">{selectedTitle}</Text>
                <IconButton
                  aria-label="Delete list"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGroup(selectedTitle)}
                />
              </HStack>
            </ModalHeader>
            <ModalBody pb={6}>
              <VStack align="stretch" spacing={2}>
                {selectedGroup.map((item, index) => (
                  <Checkbox
                    key={index}
                    isChecked={item.startsWith('✓ ')}
                    onChange={() => handleCheckItem(index)}
                    colorScheme="teal"
                    size="lg"
                    spacing={4}
                  >
                    <Text
                      color="gray.700"
                      fontSize="lg"
                      textDecoration={item.startsWith('✓ ') ? 'line-through' : 'none'}
                      opacity={item.startsWith('✓ ') ? 0.6 : 1}
                    >
                      {item.replace('✓ ', '')}
                    </Text>
                  </Checkbox>
                ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Clear All Lists?</AlertDialogHeader>
              <AlertDialogBody>
                This will remove all your shopping lists. This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
                  Cancel
                </Button>
                <Button 
                  colorScheme="red" 
                  onClick={() => {
                    handleClear();
                    onAlertClose();
                  }} 
                  ml={3}
                >
                  Delete All
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
}
