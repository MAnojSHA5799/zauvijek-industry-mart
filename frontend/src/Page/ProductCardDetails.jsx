import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Image,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useParams, Link } from "react-router-dom";
import Navbar from '../Kaushik/Navbar';
import Footer from '../Kaushik/Footer';

const ProductCardDetails = () => {
  const { id } = useParams(); // get product id from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://zauvijek-industry-mart.onrender.com/buyer/products/${id}`);
      const data = await response.json();
      setProduct(data.product); // assuming API returns { product: {...} }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" minH="70vh">
          <Spinner size="xl" color="blue.500" />
        </Flex>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <Flex justify="center" align="center" minH="70vh">
          <Text fontSize="xl">Product not found.</Text>
        </Flex>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Box maxW="1200px" mx="auto" px={4} py={10} mt={10}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={8}
          alignItems="flex-start"
        >
          {/* Product Images */}
          <Box flex="1">
            {product.images?.map((img, i) => (
              <Image
                key={i}
                src={`https://zauvijek-industry-mart.onrender.com${img}`}
                alt={product.name}
                borderRadius="md"
                mb={4}
              />
            ))}
          </Box>

          {/* Product Details */}
          <Box flex="1">
            <Heading color="#606FC4" mb={4}>
              {product.name}
            </Heading>
            <Text fontSize="xl" fontWeight="bold" mb={2}>
              ₹{product.price}
            </Text>
            <Text fontSize="md" mb={4}>
              Category: <strong>{product.category}</strong>
            </Text>
            <Text fontSize="md" mb={4}>
              {product.description}
            </Text>

            {/* Back button */}
            <Link to="/">
              <Button
                colorScheme="blue"
                _hover={{ bg: "#3182CE", transform: "scale(1.05)" }}
              >
                Back to Home
              </Button>
            </Link>
          </Box>
        </Flex>
      </Box>

      <Footer />
    </>
  );
};

export default ProductCardDetails;
