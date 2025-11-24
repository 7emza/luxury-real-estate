import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-amber-600 mb-4">LuxuryEstates</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner in finding luxury properties in Dubai's most prestigious locations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-gray-400 hover:text-amber-600 transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-600 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/properties?type=villa" className="text-gray-400 hover:text-amber-600 transition">
                  Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?type=apartment" className="text-gray-400 hover:text-amber-600 transition">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?type=townhouse" className="text-gray-400 hover:text-amber-600 transition">
                  Townhouses
                </Link>
              </li>
              <li>
                <Link href="/properties?type=commercial" className="text-gray-400 hover:text-amber-600 transition">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 +971 50 123 4567</li>
              <li>✉️ info@luxuryestates.com</li>
              <li>📍 Dubai, UAE</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LuxuryEstates. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
