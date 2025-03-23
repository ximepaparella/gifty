
import React, { useState, useEffect } from 'react';
import { cn } from '@/features/website/utils/utils';
import { Gift, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4',
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Gift className="text-gifty-500 h-7 w-7" />
          <span className="text-xl font-display font-semibold text-gray-900">Gifty</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="#features" 
            className="text-gray-600 hover:text-gifty-600 transition-colors duration-300"
          >
            Features
          </Link>
          <Link 
            href="#how-it-works" 
            className="text-gray-600 hover:text-gifty-600 transition-colors duration-300"
          >
            How it Works
          </Link>
          <Link 
            href="#testimonials" 
            className="text-gray-600 hover:text-gifty-600 transition-colors duration-300"
          >
            Testimonials
          </Link>
          <Link 
            href="/pricing" 
            className="text-gray-600 hover:text-gifty-600 transition-colors duration-300"
          >
            Pricing
          </Link>
          <Link 
            href="/store" 
            className="text-gray-600 hover:text-gifty-600 transition-colors duration-300"
          >
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-4 w-4" />
              <span>Store</span>
            </div>
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="#contact" 
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-lg text-gifty-500 
            hover:text-gifty-700 transition-colors duration-300"
          >
            Contact
          </Link>
          <Link href="#get-started" className="btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
