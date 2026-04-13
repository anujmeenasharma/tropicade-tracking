'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-6 lg:px-10 py-4">

        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img
            src="/images/logo-dark.png"
            alt="TitanX Logistics"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/logo-white.png';
              e.target.style.filter = 'invert(1)';
            }}
          />
        </Link>

        {/* Center: Desktop Nav Links — pill shaped */}
        <nav
          className="hidden xl:flex items-center rounded-full px-2 py-2"
          style={{
            backgroundColor: '#eef0f5',
            border: '1px solid #dde0e8',
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-widest transition-all duration-200
                  ${isActive
                    ? 'text-[#0d1a33] bg-white shadow-sm'
                    : 'text-[#6b7280] hover:text-[#0d1a33]'
                  }`}
                style={{ letterSpacing: '0.08em' }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: empty spacer to keep nav centered */}
        <div className="hidden xl:block w-28" />

        {/* Mobile hamburger */}
        <button
          className="xl:hidden text-gray-700 hover:text-gray-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest transition-all duration-200
                    ${isActive
                      ? 'text-[#0d1a33] bg-gray-100'
                      : 'text-gray-500 hover:text-[#0d1a33] hover:bg-gray-50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
