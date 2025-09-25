import React from "react";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Icon,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaQuoteLeft, FaRocket, FaBullseye, FaHandshake } from "react-icons/fa";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import PageBanner from "../Kaushik/PageBanner";

const AboutUs = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <PageBanner
        title="About Us"
        bgImage="/about-us.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
      />

      {/* About Content */}
      <Container maxW="7xl" py={16}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={12}
          alignItems="center"
        >
          {/* Owner Image */}
          <GridItem>
            <Image
              src="/Image/machine.jpg"
              alt="Owner"
              borderRadius="2xl"
              boxShadow="2xl"
              objectFit="cover"
              transition="0.3s"
              _hover={{ transform: "scale(1.05)" }}
            />
          </GridItem>

          {/* About Text */}
          <GridItem>
            <VStack align="flex-start" spacing={6}>
              <Text fontSize="4xl" fontWeight="bold" color="#606FC4">
                Who We Are
              </Text>
              <Text fontSize="lg" color="gray.600" lineHeight="tall">
                We are a passionate team dedicated to delivering{" "}
                <Text as="span" fontWeight="semibold" color="#606FC4">
                  innovative solutions
                </Text>{" "}
                that drive business growth in today’s digital-first world.
              </Text>
              <Text fontSize="lg" color="gray.600" lineHeight="tall">
                With years of experience, we strive to push boundaries, innovate
                constantly, and deliver meaningful impact for our clients.
              </Text>
              <Button
                size="lg"
                bg="#606FC4"
                color="white"
                borderRadius="full"
                _hover={{ bg: "#4b57a3" }}
              >
                Learn More
              </Button>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* Mission / Vision / Values */}
      <Box bg="gray.50" py={16}>
        <Container maxW="7xl">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              textAlign="center"
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <Icon as={FaRocket} boxSize={10} color="#606FC4" mb={4} />
              <Text fontSize="2xl" fontWeight="bold" color="#606FC4" mb={2}>
                Our Mission
              </Text>
              <Text color="gray.600">
                To empower businesses with cutting-edge digital solutions that
                deliver measurable results and sustainable growth.
              </Text>
            </Card>

            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              textAlign="center"
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <Icon as={FaBullseye} boxSize={10} color="#606FC4" mb={4} />
              <Text fontSize="2xl" fontWeight="bold" color="#606FC4" mb={2}>
                Our Vision
              </Text>
              <Text color="gray.600">
                To be a global leader in technology-driven innovation, enabling
                businesses to unlock their full potential.
              </Text>
            </Card>

            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              textAlign="center"
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <Icon as={FaHandshake} boxSize={10} color="#606FC4" mb={4} />
              <Text fontSize="2xl" fontWeight="bold" color="#606FC4" mb={2}>
                Our Values
              </Text>
              <Text color="gray.600">
                Integrity, collaboration, and innovation form the foundation of
                our approach to every project.
              </Text>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Quote Section */}
      <Box py={20} textAlign="center" bg="white">
        <Container maxW="4xl">
          <Icon as={FaQuoteLeft} color="#606FC4" boxSize={10} mb={6} />
          <Text fontSize="2xl" fontStyle="italic" color="gray.700" mb={4}>
            “Success is not just about ideas, it’s about making ideas happen.”
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="#606FC4">
            – Founder & CEO
          </Text>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box bg="#606FC4" py={16} color="white">
        <Container maxW="7xl">
          <Text fontSize="3xl" fontWeight="bold" textAlign="center" mb={10}>
            Why Choose Us?
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {[
              "Proven Industry Experience",
              "Customer-Centric Approach",
              "Innovative & Scalable Solutions",
            ].map((item, idx) => (
              <Card
                key={idx}
                borderRadius="2xl"
                bg="white"
                color="#606FC4"
                p={6}
                textAlign="center"
                boxShadow="xl"
                _hover={{
                  transform: "scale(1.05)",
                  transition: "0.3s",
                }}
              >
                <CardBody>
                  <Text fontWeight="semibold" fontSize="lg">
                    {item}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default AboutUs;
