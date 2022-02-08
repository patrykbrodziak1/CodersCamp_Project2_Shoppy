import { useParams, useSearchParams } from 'react-router-dom';
import { SimpleGrid, Text, Flex, Select, Spinner } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { CategoryContext } from './Store';
import { AllProductsContext } from './App';
import ProductPreview from './ProductPreview';

const SortStates = {
  NAME_ASC: 'name(asc)',
  NAME_DESC: 'name(desc)',
  PRICE_ASC: 'price(asc)',
  PRICE_DESC: 'price(desc)',
};
Object.freeze(SortStates);

const ProductList = () => {
  let { category } = useParams();
  const [sorting, setSorting] = useState(SortStates.NAME_ASC);
  const updateCategory = useContext(CategoryContext);
  const products = useContext(AllProductsContext);
  let [searchParams] = useSearchParams();

  const sortName = (a, b) => {
    let nameA = a.name.toLowerCase();
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  };

  const handleCategory = () => {
    if (category) {
      return products.filter(
        (product) => product.type.toLowerCase() === category.toLowerCase(),
      );
    } else {
      return products;
    }
  };

  const handleFilter = (productList) => {
    const filters = {
      minPrice: searchParams.get('min'),
      maxPrice: searchParams.get('max'),
      brand: searchParams
        .get('brands')
        ?.split(',')
        .map((name) => name.toLowerCase()),
    };

    const activeFilters = Object.entries(filters).filter(
      ([key, value]) => !!value,
    );
    if (activeFilters.length < 1) return productList;

    if (filters.minPrice && filters.maxPrice) {
      productList = productList.filter((product) => {
        return (
          parseFloat(product.price) >= parseFloat(filters.minPrice) &&
          parseFloat(product.price) <= parseFloat(filters.maxPrice)
        );
      });
    }
    if (filters.brand) {
      productList = productList.filter((product) =>
        filters.brand.includes(product.details.brand.toLowerCase()),
      );
    }

    return productList;
  };

  const handleSearch = (productList) => {
    let searchedName = searchParams.get('name');

    if (!searchedName) return productList;

    return productList.filter((product) =>
      product.name
        .toLowerCase()
        .includes(decodeURIComponent(searchedName.toLowerCase())),
    );
  };

  const applyFiltering = () => {
    let filteredProducts = handleCategory();
    filteredProducts = handleFilter(filteredProducts);
    filteredProducts = handleSearch(filteredProducts);

    switch (sorting) {
      case SortStates.NAME_ASC:
        return filteredProducts.sort((a, b) => sortName(a, b));
      case SortStates.NAME_DESC:
        return filteredProducts.sort((a, b) => sortName(b, a));
      case SortStates.PRICE_ASC:
        return filteredProducts.sort((a, b) => a.price - b.price);
      case SortStates.PRICE_DESC:
        return filteredProducts.sort((a, b) => b.price - a.price);
      default:
        return filteredProducts;
    }
  };

  useEffect(() => {
    setSorting('name(asc)');
    updateCategory(category);
    // eslint-disable-next-line
  }, [category]);

  return (
    <Flex justifyContent="center" flexDirection="column">
      <Flex justifyContent="flex-start" alignItems="center" m="1%">
        <Text paddingX="1%" fontWeight="semibold" fontSize="20px">
          Sort by:
        </Text>
        <Select
          size="md"
          maxWidth={190}
          variant="outline"
          borderWidth="2px"
          value={sorting}
          onChange={(e) => setSorting(e.target.value)}
        >
          <option value={SortStates.NAME_ASC}>Name: A-Z</option>
          <option value={SortStates.NAME_DESC}>Name: Z-A</option>
          <option value={SortStates.PRICE_ASC}>Price: Low to High</option>
          <option value={SortStates.PRICE_DESC}>Price: High to Low</option>
        </Select>
      </Flex>
        {parseInt(applyFiltering().length) > 0?
        (<SimpleGrid
          paddingY={5}
          minChildWidth="220px"
          justifyItems={{ base: 'center', md: 'flex-start' }}
          alignItems="center"
          spacing={1}
          rowGap="30px"
          columnGap="10px"
        >
          {products.length > 0 ? (
            applyFiltering().map((product) => (
              <ProductPreview key={product.id} product={product} />))
          ) : (
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            </Flex>
          )}
        </SimpleGrid>)
        :(
          <Flex justifyContent="center" alignItems="center" width="100%">
            <Text fontSize='40px'>No items to display</Text>
          </Flex>
        )}
    </Flex>
  );
};

export default ProductList;
