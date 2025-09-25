// src/Kaushik/BannerDisplay.jsx
import React from "react";
import { Box,Text } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/BannerDisplay.css";

const BannerDisplayTwo = () => {
  const banners = [
    {
      type: "video",
      src: "/m4.mp4",
    },
    // {
    //   type: "video",
    //   src: "/ban2.mp4",
    // },
   
  ];



  return (
    <Box
      mt={0}
      w="100%"
      h={{ base: "200px", md: "350px", lg: "450px" }}
      position="relative"
    >
      {banners.map((banner, idx) => (
        <Box key={idx} w="100%" h="90%" position="relative">
          {banner.type === "video" ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%", // ✅ container ka full width lega
                height: "100%", // ✅ container ka full height lega
                objectFit: "cover", // ✅ pura video dikhega bina cut hue
                borderRadius: "10px",
                backgroundColor: "black", // ✅ gap aaye to background safe lage
              }}
            >
              <source src={banner.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={banner.src}
              alt={banner.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}

          {/* 🔥 Overlay Image (Top Right Corner) */}
          <Box position="absolute" top="15px" right="15px" zIndex={2}>
            <img
              src="/bhart.jpg" // ✅ apna image path yaha do
              alt="Overlay Logo"
              style={{
                marginTop:"10%",
                width: "150px",
                height: "auto",
                borderRadius: "5px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BannerDisplayTwo;
