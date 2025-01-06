"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
        <div className="mb-4 md:mb-0">
          <p className="font-semibold text-gray-800">Biuro Rzeczy Znalezionych</p>
          <p className="text-gray-500">Wszystkie prawa zastrzeżone © {new Date().getFullYear()}</p>
        </div>
        
        <div className="flex space-x-4">
          <Link href="/contact" className="hover:text-green-600 transition duration-300">
            Kontakt
          </Link>
          <Link href="/privacy" className="hover:text-green-600 transition duration-300">
            Polityka prywatności
          </Link>
          <Link href="/terms" className="hover:text-green-600 transition duration-300">
            Regulamin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
