import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 pb-12">
        {/* Column 1 */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-babyPink">Baby Clothes</a></li>
            <li><a href="#" className="hover:text-babyPink">Toys</a></li>
            <li><a href="#" className="hover:text-babyPink">Strollers</a></li>
            <li><a href="#" className="hover:text-babyPink">Car Seats</a></li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-babyPink">Contact Us</a></li>
            <li><a href="#" className="hover:text-babyPink">Delivery Info</a></li>
            <li><a href="#" className="hover:text-babyPink">Returns</a></li>
            <li><a href="#" className="hover:text-babyPink">FAQs</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">About Narya Baby</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><a href="#" className="hover:text-babyPink">Our Story</a></li>
            <li><a href="#" className="hover:text-babyPink">Sustainability</a></li>
            <li><a href="#" className="hover:text-babyPink">Careers</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-babyPink" /> info@naryababy.co.ke
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-babyPink" /> +254 712 345 678
            </li>
            <li>Nairobi, Kenya</li>
          </ul>
        </div>

        {/* Column 5 */}
        <div>
          <h3 className="text-gray-800 font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-gray-600">
            <a href="#" className="hover:text-babyPink"><Facebook size={20} /></a>
            <a href="#" className="hover:text-babyPink"><Instagram size={20} /></a>
            <a href="#" className="hover:text-babyPink"><Twitter size={20} /></a>
            <a href="#" className="hover:text-babyPink"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      {/* Payment & Newsletter */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Newsletter */}
          <form className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden w-full md:w-1/2">
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="px-4 py-2 flex-1 outline-none text-gray-700"
            />
            <button className="bg-babyPink hover:bg-pink-500 text-white px-5 py-2 font-semibold transition">
              Subscribe
            </button>
          </form>

          {/* Payment Icons */}
          <div className="flex space-x-3 items-center">
            <img src="../images/payments/visaMain.png" alt="Visa" className="h-8" />
            <img src="../images/payments/M-pesa.png" alt="M-Pesa" className="h-9 w-9" />
            <img src="../images/payments/mastercard.png" alt="MasterCard" className="h-8" />
            <img src="../images/payments/paypal.png" alt="PayPal" className="h-8" />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="bg-babyBlue text-white text-center py-4 text-sm">
        © {new Date().getFullYear()} Narya Baby — Made with 💖 in Kenya.
      </div>
    </footer>
  );
}
