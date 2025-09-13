import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
function BackwordAuction() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const cardHeight = useBreakpointValue({ base: "100px", md: "100px" });

  return (
    <>
    <Navbar />
    <Flex
      gap={6}
      mt={20}
      px={{ base: 4, md: 4 }}
      flexDir={{ base: "column", lg: "row" }}
    >
      {/* Left Card */}
      <Box
        flex="1"
        bgImage="url(https://images.unsplash.com/photo-1746968728174-3d217259345d?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"
        bgSize="cover"
        bgPos="center"
        color="white"
        borderRadius="20px"
        p={6}
        display="flex"
        flexDir="column"
        justifyContent="space-between"
        minH={cardHeight}
      >
        <VStack align="start" spacing={4}>
          <Heading size="lg">Experience You Can Trust</Heading>
          <Text fontSize="sm" maxW="90%">
            14+ years of expertise in strategizing the e-auction for steel &
            metal industry. Exclusive focus on technology & tailored services
            set us apart.
          </Text>
        </VStack>
        <Button
          bg="purple.500"
          _hover={{ bg: "purple.600" }}
          color="white"
          borderRadius="10px"
          mt={4}
          alignSelf="flex-start"
        >
          Feel the difference
        </Button>
      </Box>

      {/* Middle Slider */}
      <Box
  flex="3"
  borderRadius="20px"
  overflow="hidden"
  position="relative"
  h="450px"   // 👈 Height control
>
  {/* Background Video */}
  <video
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  >
    <source src="/ban3.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Overlay Content */}
  <Box
    position="absolute"
    top="0"
    left="0"
    w="100%"
    h="100%"
    bg="rgba(0,0,0,0.4)" // 👈 हल्का dark overlay ताकि text साफ दिखे
    display="flex"
    flexDir="column"
    justifyContent="center"
    p={6}
    color="white"
  >
    <VStack spacing={4} align="start" maxW="80%">
      <Heading size="lg">A Leading Neutral Platform</Heading>
      <Text fontSize="sm">
        We proudly operate as the leading neutral portal in the e-auction
        landscape, ensuring impartiality by not being promoted or owned by
        any steel industry firm.
      </Text>
      <Button
        bg="purple.500"
        _hover={{ bg: "purple.600" }}
        color="white"
        borderRadius="10px"
      >
        Click to register
      </Button>
    </VStack>
  </Box>
</Box>



      {/* Right Cards */}
      <VStack flex="1" spacing={4}>
        <Box
          bg="white"
          borderRadius="20px"
          p={6}
          boxShadow="md"
          textAlign="left"
          w="100%"
          minH={cardHeight}
        >
          <Heading size="md" color="purple.500">
            Ready To Join As A Bidder →
          </Heading>
          <VStack align="start" mt={3} spacing={1} fontSize="sm" color="gray.700">
            <Text>› 14 years of expertise</Text>
            <Text>› Online EMD management</Text>
            <Text>› Post ads & chat facility</Text>
            <Text>› Ease of participation</Text>
          </VStack>
        </Box>

        <Box
          bgGradient="linear(to-r, purple.400, purple.600)"
          borderRadius="20px"
          p={6}
          color="white"
          textAlign="left"
          w="100%"
          minH={cardHeight}
        >
          <Heading size="md">Ready To Join As A Supplier →</Heading>
          <VStack align="start" mt={3} spacing={1} fontSize="sm">
            <Text>› Varied e-auction engines available</Text>
            <Text>› Robust Security Measures</Text>
            <Text>› Qualified and Secure Bidders</Text>
            <Text>› User-Friendly Interface</Text>
          </VStack>
        </Box>
      </VStack>
    </Flex>
    <Footer />
    </>
  );
}

export default BackwordAuction;
