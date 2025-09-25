import React from "react";
import {
  Box,
  Container,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
} from "@chakra-ui/react";

const PageBanner = ({ title, bgImage, breadcrumb }) => {
  return (
    <Box
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      color="white"
      textAlign="center"
      position="relative"
      w={"100%"}
      mt={"3.9%"}
      minH={{ base: "300px", md: "400px" }} // 🔹 Increased height
      display="flex"
      alignItems="center"
      justifyContent="center"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        w: "100%",
        h: "100%",
        bg: "rgba(28, 19, 38, 0.35)", // darker overlay for text clarity
      }}
    >
      <Container maxW="7xl" position="relative" zIndex={1}>
        {/* Title */}
        <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" mb={3}>
          {title}
        </Text>

        {/* Centered Breadcrumb */}
        {breadcrumb && (
          <Flex justify="center">
            <Breadcrumb separator="›" fontSize="md">
              {breadcrumb.map((item, index) => (
                <BreadcrumbItem
                  key={index}
                  isCurrentPage={index === breadcrumb.length - 1}
                >
                  <BreadcrumbLink
                    href={item.href || "#"}
                    color="white"
                    fontWeight={
                      index === breadcrumb.length - 1 ? "bold" : "normal"
                    }
                  >
                    {item.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          </Flex>
        )}
      </Container>
    </Box>
  );
};

export default PageBanner;
