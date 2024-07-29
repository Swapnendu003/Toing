'use client';
import React from 'react';
import { FaTachometerAlt, FaBullhorn } from 'react-icons/fa';
import { usePathname, useRouter } from 'next/navigation';

const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/main' },
    { name: 'Campaigns', icon: <FaBullhorn />, path: '/campaigns' },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 shadow-lg fixed w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-2xl">Toingg</div>
        <ul className="flex space-x-8">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => router.push(item.path)}
                className={`flex items-center space-x-2 text-white hover:text-gray-200 transition duration-300 ${
                  pathname === item.path ? 'text-gray-200' : ''
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
