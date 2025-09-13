// src/Kaushik/BannerDisplay.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/BannerDisplay.css";

const BannerDisplayTwo = () => {
  const banners = [
    {
      type: "video",
      src: "/ban1.mp4",
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
      h={{ base: "200px", md: "350px", lg: "450px" }} // ✅ ज्यादा practical height
      position="relative"
    >
        {banners.map((banner, idx) => (
          <Box key={idx} w="100%" h="90%">
            {banner.type === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%", // ✅ parent Box की height follow करेगा
                  objectFit: "cover",
                  borderRadius: "10px",
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
          </Box>
        ))}
    </Box>
  );
};

export default BannerDisplayTwo;
