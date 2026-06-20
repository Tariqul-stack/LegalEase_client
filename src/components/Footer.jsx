"use client";

import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1A3C5E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <h2 className="text-3xl font-bold">LegalEase</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">
              Connecting you with top legal professionals
            </p>

            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-white transition-colors hover:text-blue-300"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-white transition-colors hover:text-blue-300"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-white transition-colors hover:text-blue-300"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-white transition-colors hover:text-blue-300"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="mt-4 flex flex-col gap-2 text-sm">
              <Link
                href="/"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Browse Lawyers
              </Link>
              <Link
                href="/login"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-300 transition-colors hover:text-white"
              >
                Register
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <FaEnvelope className="mt-0.5 shrink-0 text-white" size={16} />
                <span>support@legalease.com</span>
              </div>
              <div className="flex items-start gap-3">
                <FaPhone className="mt-0.5 shrink-0 text-white" size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt
                  className="mt-0.5 shrink-0 text-white"
                  size={16}
                />
                <span>123 Legal Street, New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-600 pt-6">
          <p className="text-center text-sm text-gray-400">
            © 2026 LegalEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
