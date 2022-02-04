import { Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import Logo from './Logo';
import MenuIcon from './MenuIcon';
import MenuLinks from './MenuLinks';
import SearchBar from './SearchBar';

const Navbar = ({ openCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      gap="20px"
      px={{ base: '30px', md: '80px' }}
      py="50px"
      width="100%"
      height="80px"
      mb={{ base: '100px', md: '5' }}
      bg="#f1f1f1"
      borderBottom="1px solid #ccc"
      zIndex="10"
    >
      <Logo />
      <SearchBar isMenuOpen={isMenuOpen} />
      <MenuLinks isMenuOpen={isMenuOpen} openCart={openCart} />
      <MenuIcon isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
    </Flex>
  );
};

export default Navbar;
