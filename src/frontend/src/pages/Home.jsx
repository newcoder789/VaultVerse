
// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/header";
import Hero from "../components/Hero";
import AOS from 'aos';
import 'aos/dist/aos.css';



export default function App() {
  const [userPrincipal, setUserPrincipal] = useState(null);
  // useEffect(() => {
  //   AOS.init({
  //     duration: 1500,
  //     once: true,
  //   });

  //   // Check if user is authenticated (e.g., via Internet Identity or Plug)
  //   // if (window.ic?.plug?.principalId) {
  //   //   setUserPrincipal(window.ic.plug.principalId);
  //   // }
  // }, []);


  return (
    <main>
      {/* Gradient image */}
      <img className="absolute top-0 right-0 opacity-60 -z-10" src="/images/gradient.png" alt="Gradient-img" />
      
      {/* Blur effect */}
      <div className="h-0 w-[40rem] absolute top-[20%] right-[-5%] shadow-[0_0_900px_20px_#e99b63] -rotate-[30deg] -z-10"></div>
      
      <Header />
      <Hero />
     
    </main>
  );
}