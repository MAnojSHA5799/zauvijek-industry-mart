import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Button,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const BannerForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    offerText: "",
    buttonText: "",
    buttonLink: "",
    image: null,
  });

  const toast = useToast();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("subtitle", formData.subtitle);
    formDataToSend.append("offerText", formData.offerText);
    formDataToSend.append("buttonText", formData.buttonText);
    formDataToSend.append("buttonLink", formData.buttonLink);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const res = await axios.post(
        "https://zauvijek-industry-mart.onrender.com/api/banner",
        formDataToSend
      );
      toast({
        title: "Success",
        description: "Banner uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      console.log("Upload success:", res.data);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Upload error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box maxW="500px" mx="auto" mt={10} mb={10} p={6} boxShadow="lg" borderRadius="md" bg="white">
        <Heading as="h3" size="lg" textAlign="center" mb={6} color="blue.600">
          Banner Upload Form
        </Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <Input
              name="title"
              placeholder="Title"
              onChange={handleChange}
              value={formData.title}
              isRequired
            />
            <Input
              name="subtitle"
              placeholder="Subtitle"
              onChange={handleChange}
              value={formData.subtitle}
            />
            <Input
              name="offerText"
              placeholder="Offer Text"
              onChange={handleChange}
              value={formData.offerText}
            />
            <Input
              name="buttonText"
              placeholder="Button Text"
              onChange={handleChange}
              value={formData.buttonText}
            />
            <Input
              name="buttonLink"
              placeholder="Button Link"
              onChange={handleChange}
              value={formData.buttonLink}
            />
            <Input type="file" name="image" onChange={handleChange} />

            <Button type="submit" colorScheme="blue" w="100%">
              Upload Banner
            </Button>
          </VStack>
        </form>
      </Box>
      <Footer />
    </>
  );
};

export default BannerForm;
