'use client';

import { motion } from 'framer-motion';
import { Home, Sparkles, Bot, User } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const navItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'For You', icon: Sparkles, label: 'For You' },
    { id: 'Jeevan AI', icon: Bot, label: 'Jeevan AI' },
    { id: 'Profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="flex items-center justify-between bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 px-2 py-2 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl group outline-none"
            >
              {isActive && (
                <motion.div layoutId="nav-bubble" className="absolute inset-0 bg-blue-500/10 border border-blue-500/20 rounded-2xl" transition={{ type: "spring", bounce: 0.25, duration: 0.6 }} />
              )}
              <Icon size={22} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className={`relative z-10 text-[10px] mt-1 font-bold transition-all duration-300 ${isActive ? 'text-blue-400 opacity-100 translate-y-0' : 'text-gray-500 opacity-0 translate-y-2 absolute bottom-0 pointer-events-none'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}