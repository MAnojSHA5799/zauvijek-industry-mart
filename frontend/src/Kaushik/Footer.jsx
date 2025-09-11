import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Tag,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTwitter, FaInstagram, FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa";
import React from "react";

const Footer = () => {
  const brandColor = "#606FC4"; // Company Brand Color

  return (
    <Box
      bgGradient={`linear(to-r, ${brandColor}20, white)`}
      color={useColorModeValue("gray.700", "gray.200")}
      mt={10}
      borderTop="4px solid"
      borderColor={brandColor}
    >
      <Container as={Stack} maxW="6xl" py={10}>
        {/* Brand Section */}
        <Box display="flex" alignItems="center" justifyContent="center" mb={6}>
          <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" color={brandColor}>
            Zauvijek Industries Mart
          </Text>
        </Box>

        {/* Links Section */}
        <SimpleGrid
          columns={{ base: 2, sm: 2, md: 4 }}
          spacing={8}
          textAlign={{ base: "center", md: "left" }}
        >
          <Stack>
            <Text fontWeight="600" fontSize="lg" mb={2} color={brandColor}>
              Company
            </Text>
            <Link href="#">About Us</Link>
            <Link href="#">Press</Link>
            <Link href="#">Partners</Link>
            <Link href="#">Careers</Link>
            <Link href="#">Contact Us</Link>
          </Stack>

          <Stack>
            <Text fontWeight="600" fontSize="lg" mb={2} color={brandColor}>
              Product
            </Text>
            <Link href="#">Overview</Link>
            <Stack direction="row" justify={{ base: "center", md: "flex-start" }}>
              <Link href="#">Features</Link>
              <Tag size="sm" bg={brandColor} color="white">
                New
              </Tag>
            </Stack>
            <Link href="#">Tutorials</Link>
            <Link href="#">Pricing</Link>
            <Link href="#">Releases</Link>
          </Stack>

          <Stack>
            <Text fontWeight="600" fontSize="lg" mb={2} color={brandColor}>
              Legal
            </Text>
            <Link href="#">Cookies Policy</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Law Enforcement</Link>
            <Link href="#">Status</Link>
          </Stack>

          <Stack>
            <Text fontWeight="600" fontSize="lg" mb={2} color={brandColor}>
              Follow Us
            </Text>
            <Stack
              direction="row"
              spacing={3}
              justify={{ base: "center", md: "flex-start" }}
            >
              <IconButton
                as="a"
                href="#"
                aria-label="Twitter"
                icon={<FaTwitter />}
                bg={brandColor}
                color="white"
                _hover={{ bg: "#4e58a3" }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="Instagram"
                icon={<FaInstagram />}
                bg={brandColor}
                color="white"
                _hover={{ bg: "#4e58a3" }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="YouTube"
                icon={<FaYoutube />}
                bg={brandColor}
                color="white"
                _hover={{ bg: "#4e58a3" }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="Facebook"
                icon={<FaFacebook />}
                bg={brandColor}
                color="white"
                _hover={{ bg: "#4e58a3" }}
              />
              <IconButton
                as="a"
                href="#"
                aria-label="LinkedIn"
                icon={<FaLinkedin />}
                bg={brandColor}
                color="white"
                _hover={{ bg: "#4e58a3" }}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>

      {/* Bottom Text */}
      <Box borderTop="1px solid" borderColor={`${brandColor}40`} py={4}>
        <Text textAlign="center" fontSize="sm" color="gray.600">
          © 2025 Zauvijek Industries Mart. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
