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
      src: "https://videocdn.cdnpk.net/videos/983d1e86-4534-5e6c-bd24-931241c2eb91/horizontal/previews/clear/large.mp4?token=exp=1757794519~hmac=d6de22a2f279eb20e1ae86bf8cff8920158f7925f542988ddad89697ab395c31",
    },
    {
      type: "video",
      src: "https://videocdn.cdnpk.net/videos/28bc96f9-a4a7-4bef-8f49-2de93fc3395b/horizontal/previews/clear/large.mp4?token=exp=1757792059~hmac=f9aeca77f30edd9cb874dd017ae55e30c8a6c34ce055d5a09caed0258f34cb54",
    },
   
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
