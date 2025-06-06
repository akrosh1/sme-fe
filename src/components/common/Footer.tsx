'use client';
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import BrandLogo from '/public/assets/sme-logo.png';
import YMLogo from '/public/assets/ym-logo.svg';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Events & Trainings', href: '/events' },
    { label: 'Governance & Policy', href: '/governance' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/faqs' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src={BrandLogo.src}
                    alt="Crop Studio"
                    width={140}
                    height={60}
                    className="object-cover"
                  />
                </Link>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Digital Information Portal
                </h3>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Shaping a more livable world
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This portal serves as a one-stop platform for SMEs and BDSPs in
              Nepal—connecting opportunities, resources, and insights to drive
              sustainable business growth and innovation across all provinces.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact us
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  contact@company.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">(977) 9807890435</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Kathmandu, Nepal</span>
              </div>
            </div>
          </div>

          {/* Supported By */}
          <div className="lg:col-span-1">
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-3">Supported By:</p>
              <div className="flex justify-end items-center gap-2 mb-4">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src={BrandLogo.src}
                    alt="Crop Studio"
                    width={132}
                    height={50}
                    className="object-cover"
                  />
                </Link>
              </div>

              <p className="text-sm text-gray-500 mb-2">Developed by:</p>
              <div className="flex justify-end">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src={YMLogo.src}
                    alt="Crop Studio"
                    width={132}
                    height={50}
                    className="object-cover"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {currentYear} © DAI All Rights Reserved
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
