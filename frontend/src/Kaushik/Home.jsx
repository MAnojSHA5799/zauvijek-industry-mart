import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BannerDisplay from "./BannerDisplay";
import BannerDisplayTwo from "./BannerDisplayTwo";

import Slider from "react-slick";
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const logos = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/2048px-HP_logo_2012.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png",
    "https://1000logos.net/wp-content/uploads/2017/05/Reebok-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
    "https://1000logos.net/wp-content/uploads/2017/05/Reebok-logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    "https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,      // Desktop
    slidesToScroll: 1,
    autoplay: true,        // ✅ auto move enabled
    autoplaySpeed: 2000,   // 2 seconds per slide
    responsive: [
      {
        breakpoint: 768,   // Mobile / Tablet
        settings: {
          slidesToShow: 2, // 2 logos per slide
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // 1 logo very small screens
          slidesToScroll: 1,
        },
      },
    ],
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://zauvijek-industry-mart.onrender.com/buyer/products");
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const orderedCategories = Object.keys(groupedProducts).sort((a, b) => {
    if (a.toLowerCase() === "electronics") return -1;
    if (b.toLowerCase() === "electronics") return 1;
    return a.localeCompare(b);
  });

  return (
    <>
      <Navbar />

      {/* Banner */}
      

      <Box mt={10}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BannerDisplayTwo />
        </motion.div>
      </Box>
      <Box mt={-10}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <BannerDisplay />
        </motion.div>
      </Box>
      {/* B2B Marketplace Section */}
      {/* <MotionBox
        p={8}
        bg="white"
        mb={1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Heading textAlign="center" mb={6} color="#606FC4">
          B2B Marketplace
        </Heading>
        <Text textAlign="center" mb={6} fontSize="lg" color="gray.600">
          Connect with verified sellers and buyers for wholesale business
        </Text>
        <Flex justify="center" gap={4} flexWrap="wrap">
          <Button
            as={Link}
            to="/marketplace"
            bg="#606FC4"
            color="white"
            size="lg"
            _hover={{ bg: "#4b57a3", transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
          >
            Browse Products
          </Button>
          <Button
            as={Link}
            to="/signup"
            border="2px solid #606FC4"
            color="#606FC4"
            size="lg"
            variant="outline"
            _hover={{ bg: "#606FC4", color: "white", transform: "scale(1.05)" }}
            transition="all 0.3s ease-in-out"
          >
            Become a Seller
          </Button>
        </Flex>
      </MotionBox> */}

      {/* Category-wise sections */}
      <Box maxW="1200px" mx="auto" px={{ base: 2, sm: 4 }} py={{ base: 2, sm: 4 }}>
  {loading ? (
    <Text fontSize={{ base: "14px", sm: "16px" }}>Loading products...</Text>
  ) : (
    orderedCategories.map((category) => (
      <Box
        key={category}
        borderTop="3px solid #606FC4"
        backgroundColor="white"
        marginTop={{ base: "20px", sm: "40px" }}
        w="100%"
      >
        {/* Category Heading */}
        <Heading
          align="left"
          p={{ base: "5px 8px", sm: "5px 10px" }}
          fontSize={{ base: "16px", sm: "20px", md: "28px" }}
          fontFamily="Arial"
          color="#606FC4"
        >
          {capitalize(category)}
        </Heading>

        <Flex height="100%" w="100%" m="auto" p={{ base: "5px 0px", sm: "10px 0px" }}>
          <SimpleGrid
            height="100%"
            w="100%"
            columns={{ base: 2, sm: 2, md: 3 }}
            spacing={{ base: 3, sm: 4, md: 5 }}
          >
            {groupedProducts[category].slice(0, 6).map((el, i) => (
              <MotionFlex
                key={el._id}
                p={{ base: "6px", sm: "10px" }}
                flexDirection="column"
                boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, 
                           rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
                borderRadius="md"
                bg="white"
                cursor="pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Product Image */}
                <Box w="100%">
                  <Image
                    width="100%"
                    height={{ base: "140px", sm: "180px", md: "250px" }}
                    objectFit="cover"
                    borderRadius="md"
                    src={`https://zauvijek-industry-mart.onrender.com${el.images?.[0]}`}
                    alt={el.name}
                  />
                </Box>

                {/* Product Info */}
                <Box p={{ base: "6px", sm: "10px" }} align="start">
                  <Text
                    fontWeight="700"
                    fontSize={{ base: "12px", sm: "14px" }}
                    color="black"
                    noOfLines={1}
                  >
                    {el.name}
                  </Text>
                  <Text
                    fontSize={{ base: "11px", sm: "12px" }}
                    color="gray.600"
                    noOfLines={2}
                  >
                    {el.description?.slice(0, 40)}...
                  </Text>

                  {/* Price + Button */}
                  <Flex
                    mt={2}
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                  >
                    <Text
                      fontSize={{ base: "12px", sm: "13px" }}
                      fontWeight="bold"
                      color="#606FC4"
                    >
                      ₹{el.price}
                    </Text>

                    <Button
                      as={Link}
                      to={`/product/${el._id}`}
                      size="sm"
                      fontSize={{ base: "11px", sm: "13px" }}
                      color="#606FC4"
                      border="1px solid #606FC4"
                      _hover={{
                        bg: "#606FC4",
                        color: "white",
                        transform: "scale(1.05)",
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      View
                    </Button>
                  </Flex>
                </Box>
              </MotionFlex>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>
    ))
  )}
</Box>

      {/* --------------------------------Brands------------------------------------- */}
<Box borderTop="3px solid purple" backgroundColor="white" mt="20px" w="100%">
  <Heading
    align="left"
    p="5px 10px"
    fontSize={{ base: "18px", sm: "22px", md: "30px" }}
    fontFamily="Arial"
    color="#333"
  >
    Explore products from Premium Brands
  </Heading>

  <Box mt={4} px={4}>
  <Slider {...settings}>
    {logos.map((src, i) => (
      <Box key={i} display="flex" justifyContent="center" alignItems="center" p="10px">
        <Image src={src} maxH="60px" objectFit="contain" />
      </Box>
    ))}
  </Slider>
</Box>

</Box>




      <Footer />
    </>
  );
};

export default Home;
