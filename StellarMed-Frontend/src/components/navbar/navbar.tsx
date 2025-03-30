import { useState } from 'react';
import { GlobeAltIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { WalletData } from '../wallet-data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/#', current: true },
    { name: 'Create Passport', href: 'createPassport', current: false },
    { name: 'View Passport ', href: 'viewPassport', current: false },
    { name: 'Documentation', href: '#docs', current: false },
  ];

  return (
    <nav className="bg-slate-800 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <GlobeAltIcon className="h-8 w-8 text-emerald-400" />
              <span className="ml-2 text-2xl font-bold text-white">StellarMed</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Wallet Integration */}
          <div className="hidden md:block">
            <WalletData />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current ? 'bg-slate-700 text-white' : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                } block px-3 py-2 rounded-md text-base font-medium`}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t border-slate-600 pt-4">
              <WalletData />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}