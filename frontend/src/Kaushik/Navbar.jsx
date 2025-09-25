// src/Kaushik/Navbar.jsx
import React, { useState, useEffect } from "react";
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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, BellIcon } from "@chakra-ui/icons";
import { AiOutlineHome, AiOutlineShoppingCart } from "react-icons/ai";
import { BsShop } from "react-icons/bs";
import { RiCustomerService2Fill } from "react-icons/ri";
import { MdOutlineMessage } from "react-icons/md";
import { BiUserCircle } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("https://zauvijek-industry-mart.onrender.com"); // backend socket URL

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const token = localStorage.getItem("token");

  // check user login
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) setUser(userDetails);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user.role === "seller") {
        try {
          const token = localStorage.getItem("token");
          console.log("JWT Token:", token);

          const res = await axios.get("https://zauvijek-industry-mart.onrender.com/seller/notifications", {
           headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Notifications:", res.data);
          setNotifications(res.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [user]);
  

  // socket listener for live notifications
  useEffect(() => {
    if (user && user.role === "seller") {
      socket.on(`newNotification-${user._id}`, (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        toast({
          title: "New Notification",
          description: newNotif.message,
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      });
    }

    return () => {
      socket.off(`newNotification-${user?._id}`);
    };
  }, [user, toast]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    setUser(null);
    toast({ title: "Logged out successfully", status: "success", duration: 2000, isClosable: true });
    navigate("/login");
  };

  const getPathByRole = (type = "dashboard") => {
    if (!user) return "/";
    if (type === "dashboard") {
      if (user.role === "admin") return "/admin/dashboard";
      if (user.role === "seller") return "/seller/dashboard";
      if (user.role === "buyer") return "/buyer/dashboard";
    }
    if (type === "auction-add") {
      if (user.role === "buyer" || user.role === "seller") return "/auction/add";
      return null;
    }
    if (type === "auction-list") return "/auction/list";
    return "/";
  };

  const MenuLinks = () => (
    <>
      <Link to={getPathByRole("dashboard")}>
        <Text cursor="pointer" color="white">Dashboard</Text>
      </Link>
      {getPathByRole("auction-add") && (
        <Link to={getPathByRole("auction-add")}>
          <Text cursor="pointer" color="white">Add Auction</Text>
        </Link>
      )}
      <Link to={getPathByRole("auction-list")}>
        <Text cursor="pointer" color="white">All Auctions</Text>
      </Link>
      <Text cursor="pointer" color="white" onClick={handleLogout}>Sign Out</Text>
    </>
  );

  return (
    <>
      <Box width="100%" top="0px" position="fixed" zIndex={5} backgroundColor="#606FC4" mb={40}>
        <Flex h={14} alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <HStack spacing={{ base: 3, md: 8 }} alignItems="center">
            <Link to="/">
              <Box w={["220px", "240px", "160px", "200px"]} style={{ width: "300px" }}>
                <Text
                  marginLeft="10px"
                  fontSize={{ base: "16px", sm: "20px", md: "22px", lg: "24px" }}
                  fontWeight="bold"
                  color="white"
                >
                  Zauvijek Metal
                  <Text
                    as="span"
                    color="white"
                    fontSize={{ base: "2xl", md: "2xl", lg: "3xl" }}
                    fontWeight="extrabold"
                    fontFamily="'Orbitron', sans-serif"
                  >
                    X
                  </Text>{" "}
                  Mart
                </Text>
              </Box>
            </Link>
          </HStack>

          {/* Desktop Menu */}
          <Flex alignItems="center" w={{ md: "75%", md: "40%", lg: "30%" }}>
            <Box justifyContent="space-around" w="100%" display={{ base: "none", md: "flex" }}>
              <Link to="/">
                <Box mt={1} align="center">
                  <AiOutlineHome fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text fontSize="12px" color="white">
                    Home
                  </Text>
                </Box>
              </Link>

              <Link to="/marketplace">
                <Box mt={1} align="center">
                  <AiOutlineShoppingCart fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text fontSize="12px" color="white">
                    Product
                  </Text>
                </Box>
              </Link>

              <Link to="/about-us">
                <Box mt={1} align="center">
                  <BsShop fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text fontSize="12px" color="white">
                    About Us
                  </Text>
                </Box>
              </Link>

              <Link to="/services">
                <Box mt={1} align="center">
                  <RiCustomerService2Fill fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text fontSize="12px" color="white">
                    Services
                  </Text>
                </Box>
              </Link>

              <Link to="/contact-us">
                <Box mt={1} align="center">
                  <MdOutlineMessage fontSize="20px" color="#dbdbdb" cursor="pointer" />
                  <Text fontSize="12px" color="white">
                    Contact Us
                  </Text>
                </Box>
              </Link>
              {/* Notifications */}
              {user && user.role === "seller" && (
                <Menu>
                  <MenuButton position="relative">
                    <BellIcon w={8} h={5} color="white" fontSize="20px"  cursor="pointer" />
                    <Text fontSize="12px" color="white">
                    Notifications
                  </Text>
                    {notifications.length > 0 && (
                      <Badge position="absolute" top="-1" right="5" borderRadius="full" bg="red.500" color="white" fontSize="0.7em">{notifications.length}</Badge>
                    )}
                  </MenuButton>
                 
                  <MenuList>
                   {notifications.length === 0 ? (
  <MenuItem>No notifications</MenuItem>
) : (
  notifications.map((n) => (
    <MenuItem
      key={n._id}
      as={Link}
      to={`/notifications/${n._id}`}   // 👈 navigate to detail page
    >
      {n.message}
      <Text fontSize="10px" color="gray.500">
        ({new Date(n.createdAt).toLocaleString()})
      </Text>
    </MenuItem>
  ))
)}
                  </MenuList>
                </Menu>
              )}
              {/* User Section */}
              {user ? (
                <Menu>
                  <MenuButton>
                    <HStack spacing={2}>
                      <Avatar size="sm" name={user.name} bg="teal.500" />
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem as={Link} to={getPathByRole("dashboard")}>
                      Dashboard
                    </MenuItem>

                    {getPathByRole("auction-add") && (
                      <MenuItem as={Link} to={getPathByRole("auction-add")}>
                        Add Auction
                      </MenuItem>
                    )}

                    <MenuItem as={Link} to={getPathByRole("auction-list")}>
                      All Auctions
                    </MenuItem>

                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <Link to="/login">
                  <Box align="center">
                    <BiUserCircle fontSize="20px" color="#dbdbdb" cursor="pointer" />
                    <Text fontSize="12px" color="white">
                      Sign In
                    </Text>
                  </Box>
                </Link>
              )}
            </Box>

            {/* Mobile menu button */}
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: "none" }}
              backgroundColor="#2E3192"
              color="white"
              fontSize={{ base: "20px", sm: "30px" }}
              onClick={isOpen ? onClose : onOpen}
            />
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {isOpen && (
          <Box alignItems="center" pb={4} display={{ md: "none" }}>
            <Input
              onChange={(e) => setQuery(e.target.value)}
              fontSize={{ base: "12px", sm: "13px", md: "15px" }}
              placeholder="Enter product/service name"
              bg="white"
              height="40px"
              width="160px"
              marginLeft="26%"
            />
            <Link to={`/searchProduct/${query}`}>
              <Button
                fontSize="14px"
                borderRadius="0px"
                background="-webkit-gradient(linear,left top,left bottom,from(#058b80),to(#02625a))"
                color="white"
                height="40px"
                width="80px"
                fontWeight="700"
              >
                Search
              </Button>
            </Link>

            <Stack alignItems="center" as="nav" spacing={4} mt={2}>
              {user ? (
                <MenuLinks />
              ) : (
                <Link to="/login">
                  <Text cursor="pointer" color="white">
                    Login
                  </Text>
                </Link>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Navbar;
