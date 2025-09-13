import React, { useEffect, useState } from "react";
//-----------Chakra UI Components-------
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Input,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
//-----------ICONS----------------------
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { BsShop } from "react-icons/bs";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <Box
        width={"100%"}
        top={"0px"}
        position={"fixed"}
        alignItems={"center"}
        zIndex={5}
        backgroundColor="#606FC4"
      >
        <Flex h={14} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={{ base: 3, md: 8 }} alignItems={"center"}>
            <Link to="/">
              <Box
                w={["220px", "240px", "160px", "200px"]}
                className="logo"
                style={{ width: "300px" }}
              >
                <Text
                  marginLeft={"10px"}
                  fontSize={{ base: "16px", sm: "20px", md: "22px", lg: "24px" }}
                  fontWeight="bold"
                  color="white"
                >
                  Zauvijek MetalX Mart
                </Text>
              </Box>
            </Link>
          </HStack>

          <Flex alignItems={"center"} w={{ md: "75%", md: "40%", lg: "30%" }}>
            <Box
              justifyContent="space-around"
              w="100%"
              display={{ base: "none", md: "flex" }}
            >
              {/* Home */}
              <Link to={"/"}>
                <Box align="center">
                  <AiOutlineHome fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    Home
                  </Text>
                </Box>
              </Link>

              {/* Product */}
              <Link to={"/marketplace"}>
                <Box align="center">
                  <AiOutlineShoppingCart
                    fontSize="20px"
                    color="#dbdbdb"
                    cursor="pointer"
                  />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    Product
                  </Text>
                </Box>
              </Link>

              {/* About Us */}
              <Link to={"/about-us"}>
                <Box align="center">
                  <BsShop fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    About Us
                  </Text>
                </Box>
              </Link>

              {/* Services */}
              <Link to={"/services"}>
                <Box align="center">
                  <RiCustomerService2Fill
                    fontSize="20px"
                    color="#dbdbdb"
                    cursor="pointer"
                  />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    Services
                  </Text>
                </Box>
              </Link>

              {/* Contact Us */}
              <Link to={"/contact-us"}>
                <Box align="center">
                  <MdOutlineMessage
                    fontSize="20px"
                    color="#dbdbdb"
                    cursor="pointer"
                  />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    Contact Us
                  </Text>
                </Box>
              </Link>

              {/* Sign In */}
              <Link to={"/login"}>
                <Box align="center">
                  <BiUserCircle
                    fontSize="20px"
                    color="#dbdbdb"
                    cursor="pointer"
                  />
                  <Text cursor="pointer" fontSize="12px" color="white">
                    Sign In
                  </Text>
                </Box>
              </Link>
            </Box>

            {/* Mobile menu button */}
            <IconButton
              size={"md"}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              backgroundColor="#2E3192"
              color="white"
              fontSize={{ base: "20px", sm: "30px" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {isOpen ? (
          <Box alignItems={"center"} pb={4} display={{ md: "none" }}>
            <Input
              onChange={(e) => setQuery(e.target.value)}
              paddingLeft="10px"
              fontSize={{ base: "12px", sm: "13px", md: "15px" }}
              variant="unstyled"
              placeholder=" Enter product/service name"
              bg="white"
              height={{ base: "20px", sm: "30px", md: "50px" }}
              width={{ base: "140px", sm: "140px", md: "160px" }}
              borderRadius="0px"
              marginLeft={"26%"}
            />
            <Link to={`/searchProduct/${query}`}>
              <Button
                fontSize={{ base: "12px", sm: "13px", md: "15px" }}
                borderRadius="0px"
                fontFamily="arial"
                background="-webkit-gradient(linear,left top,left bottom,from(#058b80),to(#02625a))"
                colorScheme="#fff"
                p="5px 22px"
                border="none"
                margin="0"
                height={{ base: "20px", sm: "30px", md: "50px" }}
                width={"60px"}
                fontWeight="700"
              >
                Search
              </Button>
            </Link>

            <Stack alignItems={"center"} as={"nav"} spacing={4}>
              <Link to={"/login"}>
                <Text cursor="pointer" fontSize="12px" color="white">
                  Login
                </Text>
              </Link>
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
