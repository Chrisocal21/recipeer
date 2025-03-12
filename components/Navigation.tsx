'use client';

import {
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  VStack,
  useDisclosure,
  Text,
  Icon,
} from '@chakra-ui/react';
import { HamburgerIcon, StarIcon, EditIcon, CalendarIcon, CopyIcon, AddIcon, EmailIcon } from '@chakra-ui/icons';
import { BsCameraFill } from 'react-icons/bs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: EmailIcon, label: 'Home', color: 'gray.500' },
    { href: '/favorites', icon: StarIcon, label: 'Favorites', color: 'gray.500' },
    { href: '/groceries', icon: EditIcon, label: 'Groceries', color: 'gray.500' },
    { href: '/meal-plan', icon: CalendarIcon, label: 'Meal Plan', color: 'gray.500' },
    { href: '/recipes', icon: CopyIcon, label: 'Recipes', color: 'gray.500' },
    { href: '/recipes/new', icon: AddIcon, label: 'Create', color: 'gray.500' },
    { href: '/scan', icon: BsCameraFill, label: 'Scan', color: 'gray.500' },
  ].filter(item => item.href !== pathname);

  if (pathname === '/') return null;

  return (
    <>
      <IconButton
        aria-label="Menu"
        icon={<HamburgerIcon />}
        position="fixed"
        bottom={4}
        left={4}
        colorScheme="teal"
        size="lg"
        onClick={onOpen}
        borderRadius="full"
        zIndex={9999}
        boxShadow="0 2px 10px rgba(0,0,0,0.3)"
        _hover={{
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
        }}
        _active={{
          transform: 'translateY(0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
        transition="all 0.2s"
      />
      <Drawer 
        placement="left" 
        onClose={onClose} 
        isOpen={isOpen}
      >
        <DrawerOverlay />
        <DrawerContent 
          bg="gray.800"
          borderRightRadius="xl"
          overflow="hidden"
        >
          <DrawerBody p={4}>
            <VStack spacing={4} align="stretch" mt={4}>
              {menuItems.map(({ href, icon, label, color }) => (
                <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                  <VStack
                    as="button"
                    w="full"
                    p={4}
                    spacing={2}
                    align="center"
                    onClick={onClose}
                    _hover={{ bg: 'gray.700' }}
                    _active={{ bg: 'gray.600' }}
                    borderRadius="md"
                  >
                    <Icon as={icon} w={6} h={6} color={color} />
                    <Text color="white">{label}</Text>
                  </VStack>
                </Link>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
