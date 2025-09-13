// src/Kaushik/BannerDisplay.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/BannerDisplay.css"; // ✅ Custom CSS for dots/arrows

const BannerDisplayTwo = () => {
  // ✅ Public folder से direct images
  const banners = [
    { image: "/banner1.jpg", title: "Banner 1" },
    { image: "/banner2.jpg", title: "Banner 2" },
    { image: "/banner3.jpg", title: "Banner 3" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
    pauseOnHover: true,
  };

  return (
    <Box mt={2} w="100%" h={{ base: "200px", md: "330px" }} position="relative">
      <Slider >
        {banners.map((banner, idx) => (
          <Box key={idx} w="100%" h="100%">
            <img
              src={banner.image}
              alt={banner.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default BannerDisplayTwo;
