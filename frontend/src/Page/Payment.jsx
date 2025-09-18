import { Box, Stack } from '@chakra-ui/react'
import React from 'react'

import PaymentTab from '../component/akhilesh/Payment/Tab'
import {useSelector} from "react-redux"
import Address from './Address'
import Snavbar from '../component/akhilesh/Shopping/Snavbar'
import Footer from '../Kaushik/Footer'

import Navbar from "../Kaushik/Navbar";
// import Footer from "./Footer";




export const Payment = () => {
  const isLoading=useSelector(store=>store.cartReducer.isLoading)
 

 
  return (
    <>
    <Navbar /> {/* mt as number (10px) */}
    
    <Stack
      w="90%"
      m="auto"
      mt={20}
      direction={{ base: "column-reverse", md: "row" }}
      gap={{ base: 5, md: 0 }}
      justifyContent="center"
      alignItems="center"
    >
      <Box w={{ base: "100%" }} m="auto" >
        <PaymentTab />
      </Box>
  
      <Box w={{ base: "100%" }} m="auto" >
        <Address />
      </Box>
    </Stack>
  
    <Footer />
  </>
  
  )
}
