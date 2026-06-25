"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useState } from "react";
// Assuming you are using lucide-react for those dock icons based on your screenshot!
import { Home, Compass, Bookmark, User } from "lucide-react"; 

// Dummy Data for Assamese Magazine until we connect Sanity
const dummyPosts = [
  { id: 1, title: "The Roots of Bihu", excerpt: "Exploring the vibrant spring festival of Assam...", category: "Culture" },
  { id: 2, title: "Grassroots Tech", excerpt: "How the youth of Guwahati are innovating...", category: "Youth" },
  { id: 3, title: "Majuli's Heritage", excerpt: "A deep dive into the world's largest river island...", category: "Heritage" }
];

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Saved", icon: Bookmark },
    { name: "Profile", icon: User },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pb-24 relative overflow-hidden">
      
      {/* Header */}
      <header className="p-6 pt-12 border-b border-white/10">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
          Jeevan Nextgen
        </h1>
        <p className="text-gray-400 mt-2">
          {isLoaded && isSignedIn ? `Swagatom, ${user.firstName}!` : "The soul of Assam's youth."}
        </p>
      </header>

      {/* Premium Grid UI */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.02 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider">{post.category}</span>
            <h2 className="text-xl font-bold mt-2 mb-3">{post.title}</h2>
            <p className="text-gray-400 text-sm">{post.excerpt}</p>
          </motion.div>
        ))}
      </section>

      {/* Floating iOS-style Bottom Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center gap-2 sm:gap-4 z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <motion.button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              whileTap={{ scale: 0.85 }}
              className={`relative p-3.5 sm:px-5 sm:py-3 rounded-full flex items-center justify-center transition-colors ${
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={22} className={`relative z-10 ${isActive ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : ''}`} />
            </motion.button>
          );
        })}
      </div>

    </main>
  );
}