import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Button,
  Icon,
} from "@chakra-ui/react";
import { FaUsers, FaLightbulb, FaChartLine, FaArrowRight } from "react-icons/fa";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import PageBanner from "../Kaushik/PageBanner";

const Career = () => {
  const jobs = [
    {
      title: "Frontend Developer",
      location: "Remote / India",
      type: "Full-Time",
      description:
        "We are looking for a skilled React.js developer with strong UI/UX sense.",
    },
    {
      title: "Backend Developer",
      location: "Remote / India",
      type: "Full-Time",
      description:
        "Looking for a Node.js developer experienced with REST APIs & databases.",
    },
    {
      title: "UI/UX Designer",
      location: "Remote / Hybrid",
      type: "Contract",
      description:
        "Creative designer with experience in Figma, Adobe XD, and user flows.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <PageBanner
        title="Careers"
        bgImage="/career.jpg"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Careers" },
        ]}
      />

      {/* Why Work With Us */}
      <Box py={16} bg="gray.50">
        <Container maxW="7xl" textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="#606FC4" mb={8}>
            Why Work With Us?
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <CardBody>
                <Icon as={FaUsers} boxSize={10} color="#606FC4" mb={4} />
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Collaborative Culture
                </Text>
                <Text color="gray.600">
                  Work in a team that values diversity, inclusion, and teamwork.
                </Text>
              </CardBody>
            </Card>

            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <CardBody>
                <Icon as={FaLightbulb} boxSize={10} color="#606FC4" mb={4} />
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Innovative Projects
                </Text>
                <Text color="gray.600">
                  Work on cutting-edge technology and creative digital solutions.
                </Text>
              </CardBody>
            </Card>

            <Card
              borderRadius="2xl"
              boxShadow="lg"
              p={6}
              _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
            >
              <CardBody>
                <Icon as={FaChartLine} boxSize={10} color="#606FC4" mb={4} />
                <Text fontSize="xl" fontWeight="bold" mb={2}>
                  Career Growth
                </Text>
                <Text color="gray.600">
                  Unlock your potential with mentorship, training, and growth
                  opportunities.
                </Text>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Open Positions */}
      <Box py={16}>
        <Container maxW="7xl">
          <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            color="#606FC4"
            mb={12}
          >
            Open Positions
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
            {jobs.map((job, index) => (
              <Card
                key={index}
                borderRadius="2xl"
                boxShadow="lg"
                p={6}
                _hover={{ transform: "translateY(-5px)", transition: "0.3s" }}
              >
                <CardBody>
                  <Text fontSize="xl" fontWeight="bold" color="#606FC4" mb={2}>
                    {job.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mb={3}>
                    {job.location} • {job.type}
                  </Text>
                  <Text color="gray.600" mb={4}>
                    {job.description}
                  </Text>
                  <Button
                    rightIcon={<FaArrowRight />}
                    bg="#606FC4"
                    color="white"
                    _hover={{ bg: "#4b57a3" }}
                  >
                    Apply Now
                  </Button>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box bg="#606FC4" py={16} textAlign="center" color="white">
        <Container maxW="5xl">
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            Can’t find the right role?
          </Text>
          <Text fontSize="lg" mb={6}>
            We are always on the lookout for passionate individuals. Send us
            your resume and we’ll get in touch!
          </Text>
          <Button
            size="lg"
            bg="white"
            color="#606FC4"
            _hover={{ bg: "gray.100" }}
          >
            Drop Your Resume
          </Button>
        </Container>
      </Box>

      <Footer />
    </>
  );
};

export default Career;
