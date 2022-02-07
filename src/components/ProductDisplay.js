import { useParams } from 'react-router-dom';
import {
  Box,
  Image,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  List,
  ListItem,
  ListIcon,
  Text,
  Button,
} from '@chakra-ui/react';
import ChooseValue from './productDetails/ChooseValue';
import { FaAngleRight, FaShoppingCart } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ProductContext } from './ProductContext';

const ProductDisplay = ({products, setProductName}) => {
  let { productId } = useParams();
  const [productInfo, setProductInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [noOfProducts, setNoOfProducts] = useState(1);
  const { dispatch } = useContext(ProductContext);
  //getting productInfo object from firebase
  const getProduct = async (productId) => {
    const docRef = doc(db, 'products', productId);
    console.log(productId)
    setIsLoading(true);
    setError(null);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setProductInfo(docSnap.data());
      setImageURL(docSnap.data().images[0]);
      setProductName(docSnap.data().name);
      setError(null);
    } else {
      setError('Product not found');
    }

    setIsLoading(false);
  };
  
  function handleAddManyProducts() {
    const manyIndex = products.findIndex(
      (product) => product.id === productId,
    );
    dispatch({ type: 'ADD_MANY_PROD', payload: {product: products[manyIndex], count: parseInt(noOfProducts)}})
  }

  useEffect(() => {
    getProduct(productId);
    return () => {
      setProductName('');
    };
    //eslint-disable-next-line
  }, [productId]);

  if (isLoading) {
    return (
      <Flex w="100%" justifyContent="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="purple.500"
          size="xl"
        />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {productInfo && (
        <Flex flexDirection="column" flexWrap="wrap">
          <Flex
            direction={{ base: 'column', '2xl': 'row' }}
            alignItems="center"
          >
            <Flex
              flexShrink="3"
              flexDirection="column"
              w="40%"
              justifyContent="center"
              alignItems="center"
              p={5}
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                border="3px solid #f5f5f5"
                borderRadius="15px"
                boxShadow="md"
                w={{ base: '300px', md: '350px', lg: '400px' }}
                h={{ base: '300px', md: '350px', lg: '400px' }}
              >
                <Image
                  src={`https://firebasestorage.googleapis.com/v0/b/team-lp-project-2.appspot.com/o/${imageURL}?alt=media`}
                  objectFit="contain"
                  p={3}
                  maxWidth="100%"
                  maxHeight="100%"
                />
              </Flex>

              <Flex w="80%" justify="center">
                {productInfo.images.map((img) => (
                  <Image
                    key={img}
                    src={`https://firebasestorage.googleapis.com/v0/b/team-lp-project-2.appspot.com/o/${img}?alt=media`}
                    objectFit="contain"
                    w="60px"
                    m={3}
                    border={
                      img === imageURL ? '2px solid #777' : '2px solid #f1f1f1'
                    }
                    p={1}
                    borderRadius="5px"
                    onClick={() => setImageURL(img)}
                    _hover={{ cursor: 'pointer' }}
                  />
                ))}
              </Flex>
            </Flex>
            <Flex m={5} flexDirection="column" minW="=400px">
              <Text p="40px 0 10px 35px" fontSize="25px" fontWeight="semibold">
                Details:
              </Text>
              <List pl={10} spacing={3}>
                {Object.keys(productInfo.details)
                  .filter(
                    (key) => key !== 'description' && key !== 'showOnHomepage',
                  )
                  .map((keyName) => (
                    <ListItem key={keyName}>
                      <Flex alignItems="center">
                        <ListIcon size={5} as={FaAngleRight} />
                        <Text fontSize="20px" fontWeight="500">
                          {keyName}:
                        </Text>
                        <Text fontSize="20px" color="gray.700">
                          {productInfo.details[keyName]}
                        </Text>
                      </Flex>
                    </ListItem>
                  ))}
              </List>
              <Flex
                py="10%"
                alignSelf="center"
                justifyContent="center"
                gap="20px"
                w={{ base: '300px', lg: '400px' }}
              >
                <ChooseValue setNoOfProducts={(val) => setNoOfProducts(val)} />
                <Button
                  variant="solid"
                  colorScheme="purple"
                  rightIcon={<FaShoppingCart />}
                  size="lg"
                  borderRadius="15px"
                  onClick={handleAddManyProducts}
                >
                  Add to cart
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default ProductDisplay;
