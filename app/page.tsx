'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { 
  ArrowRight, Globe, User, X, Menu, Sun, Moon, 
  BookOpen, Search, Bookmark, ChevronRight, Mail, Newspaper
} from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. EDITORIAL BACKGROUND (Paper Texture & Grid)
// ==========================================
const EditorialBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 bg-[#F4F4F0] dark:bg-[#0A0A0A] transition-colors duration-500">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-overlay"></div>
    {/* Magazine Grid Lines */}
    <div className="absolute inset-0 max-w-[90rem] mx-auto border-x border-black/[0.04] dark:border-white/[0.03] flex justify-between">
      <div className="hidden lg:block w-[1px] h-full bg-black/[0.04] dark:bg-white/[0.03] ml-[25%]"></div>
      <div className="hidden lg:block w-[1px] h-full bg-black/[0.04] dark:bg-white/[0.03] mr-[25%]"></div>
    </div>
  </div>
);

// ==========================================
// 2. PREMIUM NAVIGATION (Dense Editorial Header)
// ==========================================
const PremiumHeader = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  const tabs = [
    { id: 'Frontpage', label: 'Frontpage' },
    { id: 'Curated', label: 'Curated Picks' },
    { id: 'Archive', label: 'Interactive Archive' },
    { id: 'Membership', label: 'Membership' }
  ];

  const categories = ["Literature", "Culture", "Editorials", "Interviews", "Poetry", "Essays", "Heritage"];

  return (
    <header className="fixed top-0 left-0 right-0 z-[90] bg-[#F4F4F0]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md transition-colors duration-500">
      {/* Top Dateline Bar */}
      <div className="h-8 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 md:px-8 text-[10px] uppercase tracking-widest font-bold text-black/50 dark:text-white/50">
        <span>Guwahati, Assam</span>
        <span className="hidden md:inline-block">The Soul of Assamese Literature</span>
        <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Main Branding Bar */}
      <div className="h-20 border-b-4 border-black dark:border-white flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 hidden md:flex">
          <Search size={20} className="text-[#111] dark:text-white cursor-pointer hover:text-[#C8102E] transition-colors" />
          <span className="text-xs font-bold uppercase tracking-widest cursor-pointer hover:text-[#C8102E] transition-colors">Subscribe</span>
        </div>

        <div 
          onClick={() => setActiveTab('Frontpage')}
          className="font-serif text-3xl md:text-5xl font-black italic tracking-tighter cursor-pointer text-[#111] dark:text-[#ededed] absolute left-1/2 -translate-x-1/2"
        >
          JEEVAN<span className="text-[#C8102E]">.</span>
        </div>
        
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {mounted && (
            <button onClick={toggleTheme} className="p-2 text-[#111] dark:text-[#ededed] hover:text-[#C8102E] transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
          <button onClick={() => setActiveTab('Membership')} className="flex items-center gap-2 border border-black/20 dark:border-white/20 px-4 py-1.5 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all">
            <User size={14} /> <span className="hidden md:inline-block">Account</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="h-12 border-b border-black/10 dark:border-white/10 flex items-center justify-center overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold uppercase tracking-[0.15em] whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'text-[#C8102E] border-b-2 border-[#C8102E] py-3' 
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white py-3'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Marquee (Only on Frontpage) */}
      <AnimatePresence>
        {activeTab === 'Frontpage' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-black/5 dark:border-white/5 py-2 overflow-hidden bg-black/5 dark:bg-white/5">
             <div className="flex items-center justify-center gap-8 text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">
               {categories.map((cat, i) => <span key={i} className="cursor-pointer hover:text-[#C8102E] transition-colors">{cat}</span>)}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ==========================================
// Editorial Footer
// ==========================================
const PremiumFooter = () => (
  <footer className="border-t-[8px] border-black dark:border-white bg-[#F4F4F0] dark:bg-[#0A0A0A] pt-16 pb-8 px-6 md:px-12 relative z-10 mt-20">
    <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
      <div className="md:col-span-2">
        <h2 className="font-serif text-4xl font-black italic tracking-tighter mb-6">JEEVAN<span className="text-[#C8102E]">.</span></h2>
        <p className="text-sm font-medium text-black/60 dark:text-white/60 max-w-sm leading-relaxed mb-6">A digital initiative dedicated to preserving, curating, and exploring the rich tapestry of Assamese literature and cultural perspectives.</p>
        <div className="flex items-center gap-4">
           <input type="email" placeholder="Email Address" className="bg-transparent border-b border-black/30 dark:border-white/30 py-2 text-sm focus:outline-none focus:border-[#C8102E] w-64" />
           <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#C8102E] dark:hover:bg-[#C8102E] transition-colors">Subscribe</button>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Sections</h4>
        <ul className="space-y-3 text-sm font-serif">
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors">Latest Articles</li>
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors">Editorials & Opinions</li>
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors">Literary Archive</li>
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors">Author Interviews</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-black/10 dark:border-white/10 pb-2">Connect</h4>
        <ul className="space-y-3 text-sm font-serif">
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors flex items-center gap-2">Instagram</li>
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors flex items-center gap-2">X (Twitter)</li>
          <li className="hover:text-[#C8102E] cursor-pointer transition-colors flex items-center gap-2">Facebook</li>
        </ul>
      </div>
    </div>
    <div className="max-w-[90rem] mx-auto border-t border-black/10 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 gap-4">
      <p>© {new Date().getFullYear()} Jeevan Magazine. All Rights Reserved.</p>
      <div className="flex gap-6">
        <span className="hover:text-[#C8102E] cursor-pointer">Privacy Policy</span>
        <span className="hover:text-[#C8102E] cursor-pointer">Terms of Service</span>
      </div>
    </div>
  </footer>
);

// ==========================================
// Frontpage Feed (Home)
// ==========================================
const FrontpageFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (a: any) => void, onSummarize: (a: any, e: React.MouseEvent) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 max-w-[90rem] mx-auto px-4 md:px-8 pb-20 pt-48">
      
      {/* Featured Top Article */}
      {articles.length > 0 && (
        <div className="mb-16 border-b-2 border-black/10 dark:border-white/10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center cursor-pointer group" onClick={() => onRead(articles[0])}>
            <div className="lg:col-span-8 overflow-hidden relative">
               <div className="absolute top-4 left-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10">Featured Edition</div>
               <motion.img whileHover={{ scale: 1.02 }} transition={{ duration: 0.8 }} src={articles[0].imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"} alt="Featured" className="w-full h-[50vh] lg:h-[70vh] object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700" />
            </div>
            <div className="lg:col-span-4 flex flex-col justify-center px-4">
               <span className="text-[#C8102E] text-xs font-bold uppercase tracking-widest mb-4 block">Cover Story</span>
               <h2 className="text-5xl md:text-6xl lg:text-7xl font-black font-serif italic leading-[0.9] tracking-tighter mb-6 group-hover:text-[#C8102E] transition-colors">{articles[0].title}</h2>
               <p className="text-black/60 dark:text-white/60 font-medium mb-8 line-clamp-3">Explore the deep cultural resonance and literary brilliance within our latest featured piece, delving into the heart of Assamese heritage.</p>
               <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 group-hover:border-[#C8102E] transition-colors">Read Full Article</span>
                  <button onClick={(e) => onSummarize(articles[0], e)} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-[#C8102E] hover:text-white transition-colors rounded-full" title="Editor's Digest">
                    <Bookmark size={16} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="flex items-center justify-between mb-8 border-t-4 border-black dark:border-white pt-4">
        <h3 className="font-serif text-3xl font-bold italic">Latest Dispatches</h3>
        <span className="text-xs font-bold uppercase tracking-widest text-black/50 dark:text-white/50 cursor-pointer hover:text-[#C8102E]">View All Archive <ChevronRight size={14} className="inline"/></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {articles.slice(1).map((item, index) => (
          <motion.div key={item._id || index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group cursor-pointer flex flex-col" onClick={() => onRead(item)}>
            <div className="relative w-full h-64 overflow-hidden mb-4 bg-black/5 dark:bg-white/5">
              <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <span className="text-[#C8102E] text-[10px] font-bold uppercase tracking-widest mb-2 block">{item.category || "Perspective"}</span>
            <h4 className="text-2xl font-bold font-serif leading-tight mb-3 group-hover:text-[#C8102E] transition-colors line-clamp-2">{item.title}</h4>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
              <span className="text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest">By {item.authorName || "Editorial Board"}</span>
              <button onClick={(e) => onSummarize(item, e)} className="text-[10px] font-bold uppercase tracking-widest hover:text-[#C8102E] flex items-center gap-1">
                 <Newspaper size={12}/> Digest
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================
// Static Placeholders for Editorial Density
// ==========================================
const CuratedFeed = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 max-w-[90rem] mx-auto px-4 md:px-8 pb-20 pt-48 min-h-screen">
    <div className="border-t-4 border-black dark:border-white pt-6 mb-12 flex justify-between items-end">
       <div>
         <h2 className="text-5xl font-black font-serif italic mb-2">Editor's Curated Picks.</h2>
         <p className="text-black/60 dark:text-white/60 font-medium">Hand-selected literature tailored to your reading history.</p>
       </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-black/10 dark:border-white/10 pt-12">
      <div className="lg:col-span-1 border-r border-black/10 dark:border-white/10 pr-12 hidden lg:block">
         <h4 className="font-bold uppercase tracking-widest text-xs mb-6 text-[#C8102E]">Trending Topics</h4>
         <ul className="space-y-4 font-serif text-lg">
           <li className="cursor-pointer hover:underline decoration-[#C8102E] underline-offset-4">1. Modern Assamese Poetry</li>
           <li className="cursor-pointer hover:underline decoration-[#C8102E] underline-offset-4">2. The History of Majuli</li>
           <li className="cursor-pointer hover:underline decoration-[#C8102E] underline-offset-4">3. Post-Colonial Narratives</li>
           <li className="cursor-pointer hover:underline decoration-[#C8102E] underline-offset-4">4. Interviews with Authors</li>
         </ul>
      </div>
      <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 text-center opacity-50">
         <Newspaper size={48} className="mb-6 text-[#C8102E]"/>
         <h3 className="text-2xl font-serif italic mb-2">Your personalized feed is being compiled.</h3>
         <p className="text-sm font-medium uppercase tracking-widest">Sign in to sync your preferences.</p>
      </div>
    </div>
  </motion.div>
);

const ArchiveSearch = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 max-w-[50rem] mx-auto px-4 md:px-8 pb-20 pt-48 min-h-screen flex flex-col">
    <div className="text-center mb-12">
      <Search size={32} className="mx-auto mb-6 text-[#C8102E]" />
      <h2 className="text-5xl font-black font-serif italic mb-4">Interactive Archive.</h2>
      <p className="text-black/60 dark:text-white/60 font-medium">Inquire about our extensive collection of Assamese literature using our advanced semantic search.</p>
    </div>
    
    <div className="bg-white dark:bg-[#111] border border-black/20 dark:border-white/20 p-2 flex items-center shadow-2xl relative z-20">
      <input type="text" placeholder="Search the archive or ask a literary question..." className="flex-1 bg-transparent border-none p-4 focus:outline-none font-serif text-lg placeholder:italic" disabled/>
      <button className="bg-[#111] dark:bg-white text-[#F4F4F0] dark:text-[#0A0A0A] px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C8102E] dark:hover:bg-[#C8102E] hover:text-white transition-colors">Inquire</button>
    </div>

    <div className="mt-12 opacity-40 text-center">
       <p className="text-xs font-bold uppercase tracking-widest border-t border-black/20 dark:border-white/20 pt-8 inline-block">Archive Initializing / Connection Established</p>
    </div>
  </motion.div>
);

// ==========================================
// Authentication / Membership
// ==========================================
const MembershipProfile = ({ session, isLoaded }: { session: any, isLoaded: boolean }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 max-w-[90rem] mx-auto px-4 md:px-8 pb-20 pt-48 min-h-screen flex items-center justify-center">
    <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 border border-black dark:border-white shadow-2xl bg-white dark:bg-[#111]">
      {/* Left Branding Side */}
      <div className="bg-[#111] dark:bg-white text-[#F4F4F0] dark:text-[#0A0A0A] p-12 flex flex-col justify-between">
        <div>
          <h2 className="font-serif text-4xl font-black italic tracking-tighter mb-4">JEEVAN<span className="text-[#C8102E]">.</span></h2>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C8102E]">Digital Membership</span>
        </div>
        <div className="mt-20">
          <h3 className="font-serif text-2xl mb-4">Unlock the complete literary experience.</h3>
          <ul className="space-y-4 text-sm font-medium opacity-80">
            <li className="flex items-center gap-3"><Bookmark size={16}/> Save articles to your personal library.</li>
            <li className="flex items-center gap-3"><Newspaper size={16}/> Access the daily Editor's Digest.</li>
            <li className="flex items-center gap-3"><Search size={16}/> Unlimited queries in the Interactive Archive.</li>
          </ul>
        </div>
      </div>
      
      {/* Right Action Side */}
      <div className="p-12 flex flex-col items-center justify-center text-center">
        {!isLoaded ? (
           <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Verifying credentials...</p>
        ) : !session ? (
           <>
             <User size={48} className="mb-6 opacity-20" />
             <h3 className="text-3xl font-serif font-black italic mb-2">Welcome Back.</h3>
             <p className="text-sm font-medium text-black/60 dark:text-white/60 mb-8">Sign in to access your membership benefits.</p>
             <button onClick={() => signIn()} className="w-full border-2 border-black dark:border-white py-4 font-bold tracking-widest uppercase text-xs hover:bg-[#C8102E] hover:border-[#C8102E] hover:text-white transition-all">
                Authenticate / Sign In
             </button>
           </>
        ) : (
           <>
             {session.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-24 h-24 rounded-full mb-6 border-2 border-black dark:border-white" />
              ) : (
                <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-black dark:border-white">
                  <User size={32} />
                </div>
              )}
             <h3 className="text-2xl font-serif font-black italic mb-1">{session.user?.name}</h3>
             <p className="text-xs font-bold uppercase tracking-widest text-[#C8102E] mb-8">{session.user?.email}</p>
             
             <div className="w-full border-t border-b border-black/10 dark:border-white/10 py-6 mb-8 flex justify-between px-4 text-left">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Status</span>
                  <span className="font-serif font-bold">Active Member</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Saved Articles</span>
                  <span className="font-serif font-bold">0</span>
                </div>
             </div>

             <button onClick={() => signOut()} className="text-xs font-bold uppercase tracking-widest border-b border-black dark:border-white pb-1 hover:text-[#C8102E] hover:border-[#C8102E] transition-colors">
                Sign Out
             </button>
           </>
        )}
      </div>
    </div>
  </motion.div>
);


// ==========================================
// MAIN APP CONTAINER
// ==========================================
export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('Frontpage');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null); 
  const [aiModal, setAiModal] = useState({ isOpen: false, isLoading: false, text: "", title: "" });
  
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";

  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        _id, title, englishTitle, "authorName": author->name, publishedAt, body, englishBody, "imageUrl": mainImage.asset->url
      }`;
      const data = await client.fetch(query);
      setArticles(data);
    };
    fetchData();
  }, []);

  const handleGenerateSummary = async (article: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setAiModal({ isOpen: true, isLoading: true, text: "", title: article.title || "Article" });
    
    const rawTextBlocks = article.englishBody || article.body;
    const fullText = rawTextBlocks?.map((block: any) => block.children?.[0]?.text).join(" ") || "";
    
    if (!fullText) {
      setAiModal({ isOpen: true, isLoading: false, text: "No content available to summarize.", title: article.title });
      return;
    }

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      const data = await res.json();
      
      if (res.ok && data.summary) {
         setAiModal({ isOpen: true, isLoading: false, text: data.summary, title: article.title });
      } else {
         const errorMessage = data.error || `Server Error ${res.status}: Failed to generate summary.`;
         setAiModal({ isOpen: true, isLoading: false, text: `ERROR: ${errorMessage}`, title: article.title });
      }
    } catch (error: any) {
       setAiModal({ isOpen: true, isLoading: false, text: `NETWORK ERROR: ${error.message || "Could not reach the API."}`, title: article.title });
    }
  };

  if (selectedArticle) {
    return (
      <div className="relative">
        <button 
          onClick={() => setSelectedArticle(null)} 
          className="fixed top-28 md:top-32 left-6 z-[110] bg-white dark:bg-black border border-black/20 dark:border-white/20 p-3 shadow-xl hover:-translate-x-2 transition-transform text-[#111] dark:text-white"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <PremiumHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <EditorialArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
        <EditorDigestModal state={aiModal} setState={setAiModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] dark:bg-[#0A0A0A] text-[#111] dark:text-[#ededed] font-sans transition-colors duration-500 overflow-x-hidden">
      <EditorialBackground />
      <PremiumHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        {activeTab === 'Frontpage' && <FrontpageFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
        {activeTab === 'Curated' && <CuratedFeed key="curated" />}
        {activeTab === 'Archive' && <ArchiveSearch key="archive" />}
        {activeTab === 'Membership' && <MembershipProfile key="profile" session={session} isLoaded={isLoaded} />}
      </AnimatePresence>
      
      <EditorDigestModal state={aiModal} setState={setAiModal} />
      <PremiumFooter />
    </div>
  );
}

// ==========================================
// AI SUMMARY MODAL (Editor's Digest)
// ==========================================
const EditorDigestModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="relative w-full max-w-2xl bg-[#F4F4F0] dark:bg-[#111] border-t-8 border-[#C8102E] p-8 md:p-12 shadow-2xl rounded-none">
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-4 right-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors p-2"><X size={24}/></button>
        
        <div className="flex items-start justify-between border-b-2 border-black/10 dark:border-white/10 pb-6 mb-8">
          <div>
            <h3 className="font-black text-4xl font-serif italic mb-2">Editor's Digest.</h3>
            <p className="text-xs text-black/60 dark:text-white/60 uppercase tracking-widest font-bold max-w-md line-clamp-2">Re: {state.title}</p>
          </div>
          <Bookmark size={32} className="text-[#C8102E] hidden md:block" />
        </div>
        
        <div className="min-h-[200px] flex items-center justify-center">
          {state.isLoading ? (
             <div className="flex flex-col items-center justify-center space-y-6 py-10">
               <div className="w-12 h-12 border-4 border-black/10 dark:border-white/10 border-t-[#C8102E] rounded-full animate-spin" />
               <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] animate-pulse">Extracting key insights...</p>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#111] dark:text-[#ededed] text-lg leading-[1.8] font-serif w-full drop-cap">
               <p>{state.text}</p>
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// EDITORIAL ARTICLE
// ==========================================
function EditorialArticle({ article, onSummarize }: { article: any, onSummarize: (article: any) => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [language, setLanguage] = useState<'AS' | 'EN'>('AS');

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 });
    }
  }, [article]);

  const isEnglishAvailable = !!article.englishBody;
  const showEnglish = language === 'EN' && isEnglishAvailable;
  const currentTitle = showEnglish ? article.englishTitle : article.title;
  const currentBody = showEnglish ? article.englishBody : article.body;
  
  const ui = {
    tag: language === 'AS' ? 'প্ৰবন্ধ' : 'Editorial Essay',
    aiButton: language === 'AS' ? 'সাৰাংশ' : 'Editor Digest',
    missingTrans: language === 'AS' ? '' : 'Translation unavailable. Original text displayed.'
  };

  return (
    <div className="min-h-screen pt-32 pb-32 z-10">
      
      <div className="max-w-[50rem] mx-auto px-6 mb-8 flex justify-end">
        <div className="flex text-[10px] font-bold uppercase tracking-widest border border-black/20 dark:border-white/20 p-1">
          <button onClick={() => setLanguage('AS')} className={`px-4 py-2 transition-colors ${language === 'AS' ? 'bg-[#111] dark:bg-white text-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>অসমীয়া</button>
          <button onClick={() => setLanguage('EN')} className={`px-4 py-2 transition-colors ${language === 'EN' ? 'bg-[#111] dark:bg-white text-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>English</button>
        </div>
      </div>

      <main className="max-w-[50rem] mx-auto px-6">
        <AnimatePresence>
          {language === 'EN' && !isEnglishAvailable && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-[#C8102E]/10 border-l-4 border-[#C8102E] text-[#C8102E] px-4 py-3 text-xs font-bold uppercase tracking-widest mb-8">{ui.missingTrans}</motion.div>
          )}
        </AnimatePresence>
        
        <span className="font-bold tracking-widest uppercase text-[10px] mb-6 block text-[#C8102E]">{ui.tag}</span>
        
        <motion.h1 ref={titleRef} key={currentTitle} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter font-serif italic mb-12">
           {currentTitle}
        </motion.h1>

        <div className="border-y-2 border-black/10 dark:border-white/10 py-6 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-1">By {article.authorName || 'The Editorial Board'}</h4>
            <p className="text-black/50 dark:text-white/50 text-[10px] font-bold tracking-widest uppercase">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</p>
          </div>
          <button onClick={() => onSummarize(article)} className="shrink-0 px-6 py-3 bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 font-bold uppercase tracking-widest text-[10px] hover:bg-[#C8102E] hover:text-white hover:border-[#C8102E] transition-colors flex items-center gap-2">
            <Newspaper size={14} /> {ui.aiButton}
          </button>
        </div>

        <div className="space-y-8 text-black/90 dark:text-white/90 text-xl md:text-2xl leading-[1.8] font-serif">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {currentBody?.map((block: any, index: number) => {
                const text = block.children?.[0]?.text;
                return <p key={index} className={`${index === 0 ? 'drop-cap' : ''} mb-8`}>{text}</p>;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}