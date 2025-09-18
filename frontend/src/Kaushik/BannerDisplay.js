// src/Kaushik/BannerDisplay.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import Navbar from "../Kaushik/Navbar";
import Footer from "../Kaushik/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/BannerDisplay.css"; // ✅ Custom CSS

const BannerDisplay = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios
      .get("https://zauvijek-industry-mart.onrender.com/api/banner")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setBanners(res.data);
        } else if (res.data) {
          setBanners([res.data]);
        }
      })
      .catch((err) => console.error("Banner fetch error:", err));
  }, []);

  if (banners.length === 0) return null;

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  };

  return (
    <>
      {/* <Navbar /> */}

      {/* ✅ Slider ko Box ke andar rakha */}
      <Box mt={1} w="100%" h="330px" position="relative">
        <Slider {...settings}>
          {banners.map((banner, idx) => (
            <Box key={idx} w="100%" h="300px">
              <img
                src={"https://zauvijek-industry-mart.onrender.com" + banner.image}
                alt={banner.title || `Banner ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "0px",
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {/* <Footer /> */}
    </>
  );
};

export default BannerDisplay;
