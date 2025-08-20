import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-4 md:space-y-0">
          
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base">
              © 2024 Store Rating System. All rights reserved.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm md:text-base text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;