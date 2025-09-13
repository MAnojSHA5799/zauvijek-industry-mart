import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Image, Heading, Text, Button, Flex } from "@chakra-ui/react";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const BannerDisplay = () => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:4000/api/banner")
      .then(res => {
        if (res.data) {
          setBanner(res.data);
        }
      })
      .catch(err => console.error("Banner fetch error:", err));
  }, []);
  

  if (!banner) return null;

  return (
    <>
    <Navbar />
    <Flex
      bgImage={`url(${banner.image && "http://localhost:4000" + banner.image})`}
      bgSize="cover"
      bgPos="center"
      h="300px"
      align="center"
      justify="space-between"
      p={10}
      color="black"
      borderRadius="md"
      boxShadow="lg"
    >
      <Box maxW="50%">
        <Heading size="lg">{banner.title}</Heading>
        <Text fontSize="xl" mt={2}>
          {banner.subtitle}
        </Text>
        <Text fontWeight="bold" fontSize="2xl" mt={2}>
          {banner.offerText}
        </Text>
        <Button
          mt={3}
          colorScheme="pink"
          as="a"
          href={banner.buttonLink}
          target="_blank"
        >
          {banner.buttonText}
        </Button>
      </Box>

      <Box>
        <Image
          src={"http://localhost:4000" + banner.image}
          alt="Banner"
          borderRadius="md"
        />
      </Box>
    </Flex>
    <Footer />
    </>
  );
};

export default BannerDisplay;
