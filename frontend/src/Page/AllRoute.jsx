import React from 'react'
import {Routes,Route} from "react-router-dom"
import Shome from './Shome'
import Login from '../loginandsignup/Login'
import SignupCard from '../loginandsignup/userSignup'
import Cartpage from './Cartpage'
import { Payment } from './Payment'
import LadiesPage from './LadiesPage'
import MensPage from './MensPage'
import FootwearPage from './FootwearPage'
import Industrialpage from './Industrialpage'
import Home from '../Kaushik/Home'
import PrivateRoute from './PrivateRoute'
import ProductDetails from './ProductDetails'
import Laptop from '../Kaushik/Laptop'
import Details from '../Kaushik/Details'
import B2BMarketplace from './B2BMarketplace'
import SellerDashboard from './SellerDashboard'
import AdminDashboard from './AdminDashboard'
import Services from '../../src/Kaushik/services'
import AboutUs from '../../src/Kaushik/about-us'
import ContactUs from '../../src/Kaushik/contact-us'
import Careers from '../../src/Kaushik/career'
import BannerForm from '../Kaushik/BannerForm'
import BannerDisplay from '../Kaushik/BannerDisplay'
import ProductCardDetails from './ProductCardDetails'
import ForwordAuction from './ForwordAuction'
import BackworddAuction from './BackwordAuction'
import AuctionHome from "./AuctionHome";
import AuctionList from "./AuctionList";
import AuctionForm from "./AuctionForm";

 
const AllRoute = () => {
  return (
    <>
  <Routes>
  
  <Route path="/" element={<Home/>}/>

  <Route path="/signup" element={<SignupCard/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/services" element={<Services/>}/>
  <Route path="/about-us" element={<AboutUs/>}/>
  <Route path="/contact-us" element={<ContactUs/>}/>
  <Route path="/career" element={<Careers/>}/>
  <Route path="/banner-form" element={<BannerForm/>}/>
  <Route path="/banner-display" element={<BannerDisplay/>}/>
  
  {/* B2B Marketplace Routes */}
  <Route path="/marketplace" element={<B2BMarketplace/>}/>
  <Route path="/seller/dashboard" element={<PrivateRoute><SellerDashboard/></PrivateRoute>}/>
  <Route path="/auction" element={<AuctionHome />} />
        <Route path="/auction/list" element={<AuctionList />} />
        <Route path="/auction/add" element={<AuctionForm />} />
        <Route path="/auction/edit/:id" element={<AuctionForm />} />
  <Route path="/forword-auction" element={<ForwordAuction />} />
<Route path="/backword-auction" element={<BackworddAuction />} />


  <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard/></PrivateRoute>}/>
  
  {/* Original Shopping Routes */}
  <Route path="/shopping" element={<PrivateRoute><Shome/></PrivateRoute>}/>
  <Route path="/shopping/:id" element={<ProductDetails/>}/>
  <Route path="/cart" element={<PrivateRoute><Cartpage/></PrivateRoute>}/>
  <Route path="/payment" element={<PrivateRoute><Payment/></PrivateRoute>}/>
  <Route path="/ladies" element={<LadiesPage/>}/>
  <Route path="/mens" element={<MensPage/>}/>
  <Route path="/footwear" element={<FootwearPage/>}/>
  <Route path="/industrial" element={<Industrialpage/>}/>
  <Route path="/laptop" element={<Laptop/>}/>
  <Route path="/laptop/:id" element={<Details/>}/>
  <Route path="/product/:id" element={<ProductCardDetails />} />
  
 
  </Routes>
    </>
  )
}

export default AllRoute