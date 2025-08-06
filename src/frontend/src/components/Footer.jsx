import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white text-sm mt-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Company */}
        <div>
          <h3 className="font-bold mb-4">ABOUT COMPANY</h3>
          <p className="text-gray-300 mb-2">Sint metus, integer, sociis, aenean aenean nibh biben.</p>
          <p className="mb-1">📍 3rd Street, LA</p>
          <p className="mb-1">📞 +1 (088) 456 888 (24/7)</p>
          <p>📧 info@domain.com</p>
        </div>

        {/* Our Services */}
        <div>
          <h3 className="font-bold mb-4">OUR SERVICES</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Social Marketing</li>
            <li>Email Marketing</li>
            <li>Refer And Earn</li>
            <li>Creative Management</li>
            <li>Media Support</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h3 className="font-bold mb-4">CUSTOMER SUPPORT</h3>
          <ul className="space-y-2 text-gray-300">
            <li>FAQ</li>
            <li>Knowledge Base</li>
            <li>Online Support</li>
            <li>Privacy Policy</li>
            <li>Terms & Condition</li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-bold mb-4">USEFUL LINKS</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Our terms</li>
            <li>Company story</li>
            <li>Legal Terms</li>
            <li>Partners</li>
            <li>Recent news</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a1a2e] py-5 px-6 rounded-t-2xl border-t border-indigo-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-white">
          <div className="font-bold text-lg mb-4 md:mb-0"><img className="h-20 w-20 " src="/logo.png" alt="logo"/></div>
          <ul className="flex flex-wrap gap-6 text-sm mb-4 md:mb-0 text-gray-300">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
            <li><a href="#" className="hover:text-white">Reviews</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Community</a></li>
          </ul>
          <div className="flex gap-4 text-xl text-gray-400">
            <FaFacebookF className="cursor-pointer hover:text-white" />
            <FaTwitter className="cursor-pointer hover:text-white" />
            <FaInstagram className="cursor-pointer hover:text-white" />
            <FaPinterest className="cursor-pointer hover:text-white" />
            <FaWhatsapp className="cursor-pointer hover:text-white" />
          </div>
        </div>
        <p className="text-center mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Sociable. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;