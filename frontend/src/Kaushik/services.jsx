// src/Kaushik/ServicePage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Text,
  SimpleGrid,
  VStack,
  Heading,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageBanner from "./PageBanner";

const brandColor = "#606FC4"; // 🎨 Your company color

// Example service data
const services = [
  {
    id: 1,
    title: "Custom eLearning",
    description: "Tailor-made eLearning solutions designed for your business needs.",
    icon: "📚",
  },
  {
    id: 2,
    title: "Blitz VR/AR Lab",
    description: "Immersive learning experiences using Virtual and Augmented Reality.",
    icon: "🕶️",
  },
  {
    id: 3,
    title: "Content Services",
    description: "Engaging and interactive content creation for learners.",
    icon: "✍️",
  },
  {
    id: 4,
    title: "Video Production",
    description: "High-quality educational and corporate videos for impactful training.",
    icon: "🎬",
  },
  {
    id: 5,
    title: "Learning Consulting",
    description: "Expert advice to shape effective learning strategies.",
    icon: "💡",
  },
];

const features = [
  "Interactive and engaging modules",
  "Scalable solutions for enterprises",
  "Seamless integration with LMS",
  "Mobile-friendly & responsive design",
  "AI-powered personalization",
  "24/7 support and maintenance",
];

export default function ServicePage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <PageBanner
        title="Services"
        bgImage="/images/services-banner.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />
      <Box bg="gray.50" minH="100vh" py={16} px={6}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading textAlign="center" mb={12} color={brandColor}>
            Our Services
          </Heading>
        </motion.div>

        {/* Services */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} maxW="6xl" mx="auto">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Box
                bg="white"
                p={6}
                rounded="2xl"
                shadow="md"
                border={`2px solid ${brandColor}`}
                _hover={{ shadow: "xl", transform: "translateY(-6px)", bg: brandColor, color: "white" }}
                transition="all 0.3s ease"
                textAlign="center"
              >
                <Text fontSize="5xl" mb={4}>
                  {service.icon}
                </Text>
                <Heading fontSize="xl" mb={2} color={brandColor}>
                  {service.title}
                </Heading>
                <Text color="gray.600" _groupHover={{ color: "white" }}>
                  {service.description}
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Box
            maxW="4xl"
            mx="auto"
            mt={20}
            bg="white"
            p={8}
            rounded="2xl"
            shadow="lg"
            border={`2px solid ${brandColor}`}
          >
            <Heading textAlign="center" mb={6} color={brandColor}>
              Why Choose Us?
            </Heading>
            <List spacing={3}>
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <ListItem display="flex" alignItems="center" fontWeight="medium">
                    <ListIcon as={CheckCircleIcon} color={brandColor} />
                    {feature}
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Box>
        </motion.div>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
}
