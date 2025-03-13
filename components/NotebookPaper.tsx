'use client';

import {
  Box, Input, VStack, Button, HStack, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  Checkbox, Text, Divider, IconButton, Heading, BoxProps,
  Menu, MenuButton, MenuList, MenuItem, MenuDivider,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay,
  Input as ChakraInput,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Textarea,
} from '@chakra-ui/react';
import { DeleteIcon, ChevronRightIcon, AddIcon, EditIcon, SettingsIcon, CloseIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useRef } from 'react';
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
  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableItems, setEditableItems] = useState<string[]>([]);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    try {
      const savedItems = getGroceryList();
      // Remove the array padding to avoid length issues on mobile
      setItems(savedItems);
    } catch (error) {
      console.error('Error loading grocery list:', error);
      setItems([]);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    const validItems = newItems.filter(Boolean);
    setItems(validItems);
    updateGroceryList(validItems);
  };

  const handleClear = () => {
    setItems([]);
    clearGroceryList();
  };

  const handleAddItem = (value: string) => {
    if (!value.trim()) return;

    // If no list exists, prompt for list name
    if (Object.keys(groupedItems).length === 0) {
      const createList = window.confirm('Create a new list?');
      if (createList) {
        const listName = window.prompt('Enter a name for your new list:');
        if (listName?.trim()) {
          const newItems = [...items];
          newItems.push(`[${listName}] ${value.trim()}`);
          setItems(newItems);
          updateGroceryList(newItems);
          setActiveList(listName);
        }
      }
      return;
    }

    // If no active list, prompt to select one
    if (!activeList) {
      const listKeys = Object.keys(groupedItems);
      const listName = window.prompt(
        'Add to which list?\n\nAvailable lists:\n' + listKeys.join('\n') + '\n\nOr enter a new list name:'
      );
      if (listName?.trim()) {
        const newItems = [...items];
        newItems.push(`[${listName}] ${value.trim()}`);
        setItems(newItems);
        updateGroceryList(newItems);
        setActiveList(listName);
      }
    } else {
      // Add to active list
      const newItems = [...items];
      newItems.push(`[${activeList}] ${value.trim()}`);
      setItems(newItems);
      updateGroceryList(newItems);
    }
  };

  const handleNewList = () => {
    if (!newListName.trim()) return;
    const newItems = [...items];
    newItems.push(`[${newListName}] `);
    setItems(newItems);
    updateGroceryList(newItems.filter(Boolean));
    setNewListName('');
    setIsNewListOpen(false);
  };

  const handleEditList = (title: string) => {
    const currentItems = items.filter(item => item.includes(`[${title}]`));
    if (!currentItems.length) return;

    const newName = window.prompt('Enter a new name for this list:', title);
    if (newName && newName !== title) {
      const newItems = items.map(item =>
        item.includes(`[${title}]`) ? item.replace(`[${title}]`, `[${newName}]`) : item
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

  const handleEditItems = () => {
    setEditableItems([...selectedGroup]);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    const newItems = [...items];
    const groupIndex = items.findIndex(item => item.includes(`[${selectedTitle}]`));
    newItems[groupIndex] = `[${selectedTitle}] ${editableItems.join(', ')}`;
    setItems(newItems);
    updateGroceryList(newItems);
    setIsEditMode(false);
  };

  const handleCreateList = () => {
    const listName = window.prompt('Enter a name for your new list:');
    if (!listName?.trim()) return;
    
    const newItems = [...items];
    newItems.push(`[${listName}] `);
    setItems(newItems);
    updateGroceryList(newItems.filter(Boolean));
    setActiveList(listName);
  };

  return (
    <Box {...props}>
      <VStack spacing={4}>
        <HStack w="100%" justify="space-between">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Add item"
              icon={<AddIcon />}
              colorScheme="teal"
            />
            <MenuList bg="gray.700">
              <MenuItem
                icon={<AddIcon />}
                onClick={handleCreateList}
                _hover={{ bg: 'gray.600' }}
                color="white"
              >
                Create New List
              </MenuItem>
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

        <Divider />

        {/* Recipe Groups */}
        {Object.entries(groupedItems)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([title, groupItems]) => (
            <Box
              key={title}
              w="100%"
              p={3}
              bg="gray.700"
              borderRadius="md"
              cursor="pointer"
              onClick={() => handleItemClick(title, groupItems)}
              _hover={{ bg: 'gray.600' }}
            >
              <HStack justify="space-between">
                <Text fontWeight="bold" color="white">
                  {title} ({groupItems.length})
                </Text>
                <ChevronRightIcon color="white" />
              </HStack>
              <Text color="gray.300" noOfLines={1}>
                {groupItems.map(item => item.replace('✓ ', '')).join(', ')}
              </Text>
            </Box>
          ))}

        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <ModalOverlay />
          <ModalContent bg="gray.800">
            <ModalHeader>
              <HStack justify="space-between" align="center">
                <Text color="white">{selectedTitle}</Text>
                <HStack>
                  <IconButton
                    aria-label="Edit list"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                    onClick={handleEditItems}
                  />
                  <IconButton
                    aria-label="Delete list"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGroup(selectedTitle)}
                  />
                </HStack>
              </HStack>
            </ModalHeader>
            <ModalBody pb={6}>
              {isEditMode ? (
                <VStack align="stretch" spacing={4}>
                  <Textarea
                    value={editableItems.join('\n')}
                    onChange={(e) => setEditableItems(e.target.value.split('\n'))}
                    placeholder="Enter items (one per line)"
                    minH="200px"
                    bg="gray.700"
                    color="white"
                    _hover={{ bg: 'gray.600' }}
                    _focus={{ bg: 'gray.600' }}
                  />
                  <HStack justify="flex-end">
                    <Button size="sm" onClick={() => setIsEditMode(false)}>Cancel</Button>
                    <Button size="sm" colorScheme="teal" onClick={handleSaveEdit}>Save</Button>
                  </HStack>
                </VStack>
              ) : (
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
              )}
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
