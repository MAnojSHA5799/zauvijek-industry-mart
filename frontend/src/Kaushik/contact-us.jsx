import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Input,
  Textarea,
  Button,
  Text,
  VStack,
  HStack,
  Link,
  useToast,
  Icon,
  Card,
  CardBody,
} from "@chakra-ui/react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import PageBanner from "../Kaushik/PageBanner";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const toast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "We will get back to you shortly.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <PageBanner
        title="Contact Us"
        bgImage="/images/contact-banner.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />
      <Container maxW="7xl" py={12}>
        <Text
          fontSize="4xl"
          fontWeight="bold"
          textAlign="center"
          color="#606FC4"
          mb={10}
        >
          Contact Us
        </Text>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={10}>
          {/* Contact Form */}
          <Card boxShadow="lg" borderRadius="2xl">
            <CardBody>
              <Text fontSize="2xl" fontWeight="semibold" mb={4} color="#606FC4">
                Get in Touch
              </Text>
              <VStack as="form" spacing={4} onSubmit={handleSubmit}>
                <Input
                  placeholder="Your Name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
                <Input
                  type="email"
                  placeholder="Your Email *"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                <Input
                  type="tel"
                  placeholder="Your Phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Input
                  placeholder="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                />
                <Textarea
                  placeholder="Your Message *"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  w="100%"
                  bg="#606FC4"
                  color="white"
                  _hover={{ bg: "#4f5ab8" }}
                >
                  Send Message
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Contact Info + Map */}
          <VStack spacing={6} align="stretch">
            <Card boxShadow="lg" borderRadius="2xl">
              <CardBody>
                <Text
                  fontSize="2xl"
                  fontWeight="semibold"
                  mb={4}
                  color="#606FC4"
                >
                  Contact Info
                </Text>
                <VStack align="flex-start" spacing={3}>
                  <HStack>
                    <Icon as={FaMapMarkerAlt} color="#606FC4" />
                    <Text>123 Corporate Street, New Delhi, India</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaPhoneAlt} color="#606FC4" />
                    <Text>+91 78605 44872</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FaEnvelope} color="#606FC4" />
                    <Text>support@company.com</Text>
                  </HStack>
                </VStack>

                {/* Social Links */}
                <HStack spacing={6} mt={6}>
                  <Link href="#" color="#606FC4" _hover={{ color: "black" }}>
                    <Icon as={FaFacebook} boxSize={5} />
                  </Link>
                  <Link href="#" color="#606FC4" _hover={{ color: "black" }}>
                    <Icon as={FaTwitter} boxSize={5} />
                  </Link>
                  <Link href="#" color="#606FC4" _hover={{ color: "black" }}>
                    <Icon as={FaLinkedin} boxSize={5} />
                  </Link>
                  <Link href="#" color="#606FC4" _hover={{ color: "black" }}>
                    <Icon as={FaInstagram} boxSize={5} />
                  </Link>
                </HStack>
              </CardBody>
            </Card>

            {/* Google Map */}
            <Card boxShadow="lg" borderRadius="2xl" overflow="hidden">
              <iframe
                title="company-location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14008.491946316995!2d77.21672115!3d28.64480005"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Card>
          </VStack>
        </Grid>
      </Container>

      <Footer />
    </>
  );
};

export default ContactPage;
