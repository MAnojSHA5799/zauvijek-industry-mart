// src/Kaushik/ServicePage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Box,
  Text,
  SimpleGrid,
  Heading,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageBanner from "./PageBanner";

const brandColor = "#606FC4"; // 🎨 Company brand color

// ✅ Services data (metal industry ke hisaab se example)
const services = [
  {
    id: 1,
    title: "Metal Fabrication",
    description:
      "High-quality fabrication services for industrial and commercial needs.",
    icon: "⚙️",
  },
  {
    id: 2,
    title: "Casting Solutions",
    description:
      "Durable casting products tailored for heavy-duty applications.",
    icon: "🏭",
  },
  {
    id: 3,
    title: "Machining Services",
    description: "Precision machining with advanced CNC technology.",
    icon: "🔩",
  },
  {
    id: 4,
    title: "Surface Treatment",
    description: "Rust-resistant coating and finishing for all metal products.",
    icon: "🎨",
  },
  {
    id: 5,
    title: "Custom Metal Design",
    description: "Bespoke metal designs built to your specifications.",
    icon: "🛠️",
  },
];

// ✅ Features data
const features = [
  "Strong industry expertise",
  "Advanced machinery and technology",
  "Customizable solutions",
  "Timely delivery and logistics",
  "Quality assurance at every step",
  "24/7 customer support",
];

export default function ServicePage() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Page Banner */}
      <PageBanner
        title="Our Services"
        bgImage="/our-work.jpg" // ⚡️ Make sure this exists in /public/Image
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Services" },
        ]}
      />

      {/* Services Section */}
      <Box bg="gray.50" minH="100vh" py={16} px={6}>
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading textAlign="center" mb={12} color={brandColor}>
            What We Offer
          </Heading>
        </motion.div>

        {/* Service Cards */}
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={8}
          maxW="6xl"
          mx="auto"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Box
                role="group"
                bg="white"
                p={6}
                rounded="2xl"
                shadow="md"
                border={`2px solid ${brandColor}`}
                _hover={{
                  shadow: "xl",
                  transform: "translateY(-6px)",
                  bg: brandColor,
                }}
                transition="all 0.3s ease"
                textAlign="center"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Text fontSize="5xl" mb={4}>
                    {service.icon}
                  </Text>
                </motion.div>

                {/* Title */}
                <Heading
                  fontSize="xl"
                  mb={2}
                  color={brandColor}
                  _groupHover={{ color: "white" }}
                >
                  {service.title}
                </Heading>

                {/* Description */}
                <Text color="gray.600" _groupHover={{ color: "white" }}>
                  {service.description}
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* Features Section */}
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
                  <ListItem
                    display="flex"
                    alignItems="center"
                    fontWeight="medium"
                  >
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
