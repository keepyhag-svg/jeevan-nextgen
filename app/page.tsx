'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoreHorizontal, ArrowUpRight, Search, Menu, User, Calendar, Share2, Bookmark, EyeOff } from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// ==========================================
// 1. AWWWARDS-TIER BRAND HEADER
// ==========================================
const PremiumHeader = ({ onOpenMenu, onOpenProfile }: { onOpenMenu: () => void, onOpenProfile: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-6">
      <button onClick={onOpenMenu} className="text-black hover:opacity-60 transition-opacity">
        <Menu size={22} />
      </button>
      <div className="text-xl font-bold tracking-tighter font-serif">
        W<span className="text-gray-400">.</span>CREATORS
      </div>
    </div>
    
    <div className="hidden md:flex items-center flex-1 max-w-md mx-12">
      <div className="relative w-full flex items-center">
        <Search size={16} className="absolute left-3 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by inspiration..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button onClick={onOpenProfile} className="text-black hover:opacity-60 transition-opacity">
        <User size={20} />
      </button>
    </div>
  </nav>
);

// ==========================================
// 2. MINIMAL CONTENT DROPDOWN (3 DOTS)
// ==========================================
const TileActionsDropdown = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-40 py-1 text-left">
        <button onClick={onClose} className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Share2 size={14} /> Share Inspiration
        </button>
        <button onClick={onClose} className="w-full px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <Bookmark size={14} /> Save to Collection
        </button>
        <button onClick={onClose} className="w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-gray-50 flex items-center gap-2">
          <EyeOff size={14} /> Hide this item
        </button>
      </div>
    </>
  );
};

// ==========================================
// 3. EDITORIAL ARTICLE TILES (NOW WITH LINKS)
// ==========================================
const ArticleTile = ({ item }: { item: any }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Next.js Link triggers the Intercepting Route */}
        <Link href={`/article/${item._id}`}>
          <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative border-b border-gray-100 cursor-pointer">
            <img 
              src={item.imageUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out" 
            />
          </div>
          <div className="p-5 cursor-pointer">
            <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Latest Post Submission</div>
            <h3 className="text-xl font-bold font-serif text-black leading-tight group-hover:underline decoration-1">
              {item.title}
            </h3>
          </div>
        </Link>
      </div>

      <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-4 h-12">
        <span className="text-xs text-gray-500 font-medium">by {item.authorName || "Contributor"}</span>
        <div className="relative">
          <button 
            onClick={(e) => { e.preventDefault(); setDropdownOpen(!dropdownOpen); }} 
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
          >
            <MoreHorizontal size={18} />
          </button>
          <TileActionsDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. MAIN MAGAZINE PAGE CONTAINER
// ==========================================
export default function AppContainer() {
  const [articles, setArticles] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { data: session } = useSession?.() || { data: null };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const query = `*[_type == "post"] | order(publishedAt desc) {
          _id, title, englishTitle, "authorName": author->name, publishedAt, body, englishBody, "imageUrl": mainImage.asset->url
        }`;
        const data = await client.fetch(query);
        setArticles(data);
      } catch (err) {
        // Safe fallback mock array matching Awwwards format
        setArticles([
          { _id: '1', title: 'PALLADIO GROUP', authorName: 'KF ADV', publishedAt: '2026-05-13' },
          { _id: '2', title: 'EV01 SWAPSPACE', authorName: 'Lusion Pro', publishedAt: '2026-06-20' },
          { _id: '3', title: 'DIGITALISTS ENGINE', authorName: 'Media Agency', publishedAt: '2026-06-25' }
        ]);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans antialiased">
      <PremiumHeader onOpenMenu={() => setMenuOpen(true)} onOpenProfile={() => setProfileOpen(true)} />
      
      {/* Target Content Sheet Layout */}
      <main className="pt-28 pb-24 max-w-7xl mx-auto px-6">
        <div className="border-b border-gray-200 pb-6 mb-10 flex justify-between items-end">
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Site Collection</div>
            <h1 className="text-3xl font-bold tracking-tight font-serif">Nominees</h1>
          </div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Current Date: June 26, 2026
          </div>
        </div>

        {/* Dynamic Multi-Column Unboxed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((item, idx) => (
            <ArticleTile key={item._id || idx} item={item} />
          ))}
        </div>
      </main>

      {/* ==========================================
          5. FULL SCREEN SIDEBAR NAVIGATION OVERLAY
          ========================================== */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-sm flex">
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35 }}
              className="w-full max-w-md bg-white h-full p-8 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex justify-between items-center mb-12">
                  <div className="text-lg font-bold font-serif">Navigation</div>
                  <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                </div>
                <div className="space-y-4 text-2xl font-bold font-serif tracking-tight">
                  {['Explore Winners', 'Design Collections', 'Creative Directory', 'Academy Portal', 'Job Marketboard'].map((link, idx) => (
                    <div key={idx} className="hover:translate-x-1 transition-transform cursor-pointer flex items-center justify-between group py-2 border-b border-gray-50">
                      <span className="group-hover:text-gray-600">{link}</span>
                      <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-400 font-medium border-t border-gray-100 pt-6">
                © 2026 JEEVAN MAGAZINE ENGINE. All rights reserved.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==========================================
          6. AWWWARDS-REPLICA STARK AUTH LOG IN OVERLAY
          ========================================== */}
      <AnimatePresence>
        {profileOpen && (
          <div className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-sm flex justify-center items-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gray-50 border border-gray-200 shadow-2xl relative overflow-hidden rounded-xl"
            >
              <div className="bg-white p-8 border-b border-gray-200 text-center relative">
                <button onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full text-gray-400"><X size={16} /></button>
                <div className="text-6xl font-black font-serif tracking-tighter mb-2 text-black flex justify-center items-center gap-1">
                  W<span className="text-emerald-400 text-5xl">.</span>
                </div>
                <div className="text-lg font-bold tracking-tight text-gray-900 mt-4">Welcome!</div>
                <div className="text-xs text-gray-400 mt-1">Access secure digital portfolios and curated feeds.</div>
              </div>

              <div className="p-8 space-y-5 bg-white">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Email or Username</label>
                  <input type="text" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors" placeholder="name@domain.com" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1.5">Password</label>
                  <input type="password" className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors" placeholder="••••••••" />
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 accent-black" /> Keep me logged in
                  </label>
                  <span className="text-gray-400 hover:text-black cursor-pointer underline">Forgot password?</span>
                </div>

                <button className="w-full bg-black text-white font-bold py-3.5 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity mt-4 rounded-lg">
                  Log in now
                </button>
                
                <div className="text-center text-xs text-gray-400 pt-2">
                  Not a member yet? <span className="text-black font-bold underline cursor-pointer">Register now</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}