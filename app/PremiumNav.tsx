'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Instagram, Facebook, Twitter } from 'lucide-react';

export default function PremiumNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Check initial theme
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  const navLinks = ['Home', 'For You', 'Jeevan AI', 'Profile'];

  return (
    <>
      {/* The 3-Line Hamburger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-[100] w-14 h-14 rounded-full theme-glass theme-border border flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Menu size={24} className="text-[var(--foreground)]" />
      </button>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ clipPath: 'circle(0% at 100% 0)' }}
            animate={{ clipPath: 'circle(150% at 100% 0)' }}
            exit={{ clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[150] bg-[var(--background)] flex flex-col justify-between p-10 md:p-20"
          >
            {/* Top Bar inside Menu */}
            <div className="flex justify-between items-center w-full">
              <h2 className="font-serif text-2xl font-black italic tracking-widest">JEEVAN.</h2>
              <button onClick={() => setIsOpen(false)} className="p-4 hover:rotate-90 transition-transform">
                <X size={32} />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-col gap-6 md:gap-10 mt-12">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                >
                  <button 
                    onClick={() => handleNav(link)}
                    className={`font-serif text-5xl md:text-8xl font-black tracking-tighter uppercase text-left transition-colors hover:opacity-50 ${activeTab === link ? 'opacity-100' : 'opacity-40'}`}
                  >
                    {link}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bottom Footer inside Menu (Socials & Theme Toggle) */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mt-auto pt-10 border-t theme-border gap-8"
            >
              <div className="flex gap-6">
                <a href="#" className="hover:opacity-50 transition-opacity"><Instagram size={24} /></a>
                <a href="#" className="hover:opacity-50 transition-opacity"><Facebook size={24} /></a>
                <a href="#" className="hover:opacity-50 transition-opacity"><Twitter size={24} /></a>
              </div>

              <button 
                onClick={toggleTheme}
                className="flex items-center gap-3 px-6 py-3 rounded-full theme-glass theme-border border uppercase text-xs font-bold tracking-widest"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}