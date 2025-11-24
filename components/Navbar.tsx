'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-amber-600">
            LuxuryEstates
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 transition">
              Home
            </Link>
            <Link href="/properties" className="text-gray-700 hover:text-amber-600 transition">
              Properties
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition">
              Contact
            </Link>
            <Link href="/properties" className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 text-gray-700 hover:text-amber-600">
              Home
            </Link>
            <Link href="/properties" className="block py-2 text-gray-700 hover:text-amber-600">
              Properties
            </Link>
            <Link href="/about" className="block py-2 text-gray-700 hover:text-amber-600">
              About
            </Link>
            <Link href="/contact" className="block py-2 text-gray-700 hover:text-amber-600">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
