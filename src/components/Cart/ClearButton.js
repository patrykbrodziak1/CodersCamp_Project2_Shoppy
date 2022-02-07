import React, { useContext } from 'react';
import { Button } from '@chakra-ui/react';
import { ProductContext } from '../ProductContext';
import { FaTrashAlt } from 'react-icons/fa';

function ClearButton() {
  function handleClearCart() {
    dispatch({ type: 'CLEAR_CART' });
  }

  const { dispatch } = useContext(ProductContext);
  return (
    <Button
      rightIcon={<FaTrashAlt />}
      width="140px"
      colorScheme="purple"
      variant="outline"
      borderWidth={2}
      onClick={handleClearCart}
      size="lg"
    >
      Clear cart
    </Button>
  );
}

export default ClearButton;
