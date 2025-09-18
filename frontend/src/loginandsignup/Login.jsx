import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";

const login = async (data) => {
  try {
    const res = await fetch("https://zauvijek-industry-mart.onrender.com/user/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.log(err);
    return { message: "Server error" };
  }
};

const initdata = { email: "", password: "" };

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setdata] = useState(initdata);
  const navigate = useNavigate();
  const toast = useToast();

  const handlechange = (e) => {
    const { name, value } = e.target;
    setdata({ ...data, [name]: value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    const res = await login(data);
    if (res.token) {
      localStorage.setItem("token", JSON.stringify(res.token));
      localStorage.setItem("userDetails", JSON.stringify(res.userDetails));

      toast({
        title: res.message,
        description: `Welcome ${res.userDetails.name}! Role: ${res.userDetails.role}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      if (res.userDetails.role === "admin") navigate("/admin/dashboard");
      else if (res.userDetails.role === "seller") navigate("/seller/dashboard");
      else navigate("/");
    } else {
      toast({
        title: "Login Failed",
        description: res.message || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setdata(initdata);
  };

  const { email, password } = data;

  return (
    <>
      <Navbar />
      <Flex
        mt="3%"
        minH="100vh"
        bg="gray.50"
        direction={{ base: "column", md: "row" }}
        align="stretch"
      >
        {/* Left Side Image with Gradient */}
        <Box
          flex="1"
          display={{ base: "none", md: "block" }}
          position="relative"
        >
          <Image
            src="/as.jpg"
            alt="Login Illustration"
            objectFit="cover"
            h="100%"
            w="100%"
            boxShadow="2xl"
          />
          <Box
            position="absolute"
            top="0"
            left="0"
            w="100%"
            h="100%"
            bg="linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.1))"
          />
        </Box>

        {/* Right Side Form Box */}
        <Flex flex="1" align="center" justify="center" p={8}>
          <Box
            mt="0%"
            w="100%"
            maxW="md"
            bg="white"
            p={8}
            rounded="lg"
            // boxShadow="lg"
            h="auto"
          >
            <Stack textAlign="center" mb={6}>
              <Heading
                fontSize={{ base: "2xl", md: "3xl" }}
                color="#606FC4"
                fontWeight="bold"
                mb={4}
                textAlign="center"
              >
                Welcome — Let's Log In
              </Heading>

              <Text fontSize="1xl" color="gray.600">
                Please login to continue to Zauvijek MetalX Mart
              </Text>
            </Stack>

            <form onSubmit={handlesubmit}>
              <Stack spacing={4}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    type="email"
                    onChange={handlechange}
                    value={email}
                    name="email"
                    color="black"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? "text" : "password"}
                      onChange={handlechange}
                      value={password}
                      name="password"
                      color="black"
                    />
                    <InputRightElement h="full">
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  bg="#606FC4"
                  color="white"
                  _hover={{ bg: "#4a55a1" }}
                  borderRadius="full"
                >
                  Login
                </Button>

                <Text align="center" color="black" fontWeight="bold">
                  Not have an account?{" "}
                  <Link to="/signup" style={{ color: "#606FC4" }}>
                    Signup
                  </Link>
                </Text>
              </Stack>
            </form>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </>
  );
}
