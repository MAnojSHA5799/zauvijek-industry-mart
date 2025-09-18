// src/components/EventsUpdates.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
} from "@chakra-ui/react";

const EventsUpdates = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/events"); // ✅ backend se events
        setEvents(res.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    onOpen();
  };

  return (
    <>
      {events.map((event, idx) => (
        <Box
          key={idx}
          onClick={() => handleOpenModal(event)}
          _hover={{ color: "#d7dbf7" }}
          cursor="pointer"
          mb={2}
        >
          <Text fontSize="14px" color="white">
            › {event.title.length > 60 ? event.title.slice(0, 60) + "..." : event.title}
          </Text>
        </Box>
      ))}

      {/* ✅ Modal */}
      {selectedEvent && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="#606FC4" fontWeight="bold">
              {selectedEvent.title}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedEvent.urlToImage && (
                <Image
                  src={selectedEvent.urlToImage}
                  alt={selectedEvent.title}
                  borderRadius="md"
                  mb={4}
                />
              )}
              <Text fontSize="sm" color="gray.500" mb={2}>
                Published: {new Date(selectedEvent.publishedAt).toLocaleString()}
              </Text>
              <Text fontSize="md" color="gray.700" mb={4}>
                {selectedEvent.description || "No description available."}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button
                as="a"
                href={selectedEvent.url}
                target="_blank"
                rel="noreferrer"
                bg="#606FC4"
                color="white"
                _hover={{ bg: "#5058B3" }}
                mr={3}
              >
                Read Full Article
              </Button>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default EventsUpdates;
