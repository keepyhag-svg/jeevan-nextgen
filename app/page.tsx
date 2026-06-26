'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { 
  Sparkles, ArrowRight, Globe, Home, User as UserIcon, 
  X, Compass, Flame, Menu, Sun, Moon, BookOpen 
} from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. EDITORIAL BACKGROUND (Subtle Paper Grain)
// ==========================================
const EditorialBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 bg-[#f7f7f5] dark:bg-[#050505] transition-colors duration-500">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] dark:opacity-[0.02] mix-blend-multiply dark:mix-blend-overlay"></div>
  </div>
);

// ==========================================
// 2. PREMIUM NAVIGATION (Awwwards Hamburger)
// ==========================================
const PremiumNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 md:top-8 md:right-10 z-[100] w-14 h-14 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
      >
        <Menu size={24} className="text-[#111] dark:text-[#ededed]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ clipPath: 'circle(0% at 100% 0)' }}
            animate={{ clipPath: 'circle(150% at 100% 0)' }}
            exit={{ clipPath: 'circle(0% at 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[150] bg-[#f7f7f5] dark:bg-[#050505] flex flex-col justify-between p-8 md:p-20 text-[#111] dark:text-[#ededed]"
          >
            <div className="flex justify-between items-center w-full border-b border-black/10 dark:border-white/10 pb-6">
              <h2 className="font-serif text-3xl font-black italic tracking-widest">JEEVAN.</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:rotate-90 transition-transform">
                <X size={32} />
              </button>
            </div>

            <div className="flex flex-col gap-4 md:gap-8 mt-12 flex-1 justify-center">
              {navLinks.map((link, i) => (
                <motion.div 
                  key={link}
                  initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                >
                  <button 
                    onClick={() => handleNav(link)}
                    className={`font-serif text-5xl md:text-8xl font-black tracking-tighter uppercase text-left transition-all hover:opacity-50 hover:pl-4 ${activeTab === link ? 'opacity-100' : 'opacity-30 dark:opacity-40'}`}
                  >
                    {link}
                  </button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center mt-auto pt-10 border-t border-black/10 dark:border-white/10 gap-8"
            >
              <div className="flex gap-8">
                <a href="#" className="hover:opacity-50 transition-opacity flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <Globe size={16} className="opacity-50" /> IG
                </a>
                <a href="#" className="hover:opacity-50 transition-opacity flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <Globe size={16} className="opacity-50" /> FB
                </a>
                <a href="#" className="hover:opacity-50 transition-opacity flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <Globe size={16} className="opacity-50" /> X
                </a>
              </div>

              <button 
                onClick={toggleTheme}
                className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 uppercase text-xs font-bold tracking-widest hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// Elegant Text Component
// ==========================================
const AnimatedParagraph = ({ text, className = "" }: { text: string, className?: string }) => {
  if (!text) return null;
  return (
    <motion.p 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {text}
    </motion.p>
  );
};

// ==========================================
// 3. EDITORIAL HERO & FEED
// ==========================================
const EditorialHero = () => (
  <div className="relative pt-32 pb-16 flex flex-col items-center justify-center text-center px-6 z-10 border-b border-black/10 dark:border-white/10">
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-black/50 dark:text-white/50 tracking-[0.2em] uppercase mb-6">
      A Jeevan Initiative
    </motion.p>
    
    <motion.h1 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
      className="text-6xl md:text-8xl font-black text-[#111] dark:text-[#ededed] tracking-tighter mb-6 leading-[0.9] font-serif"
    >
      The Soul of <br/> 
      <span className="italic font-light">Assamese</span> Literature.
    </motion.h1>
    
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="max-w-xl text-black/70 dark:text-white/70 text-lg leading-relaxed">
      Curated perspectives, cultural heritage, and modern essays. Read the latest issue of জীৱন অসমীয়া আলোচনী.
    </motion.p>
  </div>
);

const InfiniteTicker = () => (
  <div className="w-full overflow-hidden border-b border-black/10 dark:border-white/10 py-4 z-10 relative flex mb-16 bg-black/5 dark:bg-white/5">
    <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-12 text-xs font-bold tracking-widest uppercase text-black/60 dark:text-white/60 pr-12">
      {[...Array(8)].map((_, i) => (
        <span key={i} className="flex items-center gap-6">
          ISSUE NO. 01 <span className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30"/> 
          অসমীয়া সাহিত্য <span className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30"/> 
          CULTURE & PERSPECTIVE <span className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30"/>
        </span>
      ))}
    </motion.div>
  </div>
);

const EditorialFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (article: any) => void, onSummarize: (article: any, e: React.MouseEvent) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 max-w-7xl mx-auto px-6 pb-32">
      <EditorialHero />
      <InfiniteTicker />

      <div className="flex items-end justify-between mb-12 border-b border-black/10 dark:border-white/10 pb-4">
        <h2 className="text-4xl font-bold text-[#111] dark:text-white tracking-tight">Latest Stories</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 gap-y-16">
        {articles.map((item, index) => (
          <motion.div 
            key={item._id || index}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`group cursor-pointer flex flex-col ${index === 0 ? 'md:col-span-12' : 'md:col-span-6 lg:col-span-4'}`}
            onClick={() => onRead(item)}
          >
            <div className={`relative w-full overflow-hidden bg-black/5 dark:bg-white/5 mb-6 ${index === 0 ? 'h-[60vh]' : 'h-80'}`}>
              <motion.img 
                whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} 
                src={item.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"} 
                alt={item.title} 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute top-4 left-4 bg-[#f7f7f5] dark:bg-[#050505] px-3 py-1 border border-black/10 dark:border-white/10">
                <span className="text-xs font-bold text-[#111] dark:text-white uppercase tracking-widest">{item.category || "Culture"}</span>
              </div>
            </div>
            
            <div className="flex flex-col flex-1">
              <h3 className="text-3xl font-bold text-[#111] dark:text-white leading-tight mb-4 font-serif group-hover:opacity-70 transition-opacity">
                {item.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-black/10 dark:border-white/10">
                <span className="text-sm font-bold text-[#111] dark:text-white flex items-center gap-2">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                
                <button 
                  onClick={(e) => onSummarize(item, e)} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#111] dark:bg-white text-[#f7f7f5] dark:text-[#050505] text-xs font-bold tracking-widest uppercase transition-transform hover:scale-105"
                >
                  <BookOpen size={14} /> AI Summary
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN APP CONTAINER
// ==========================================
export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('Home');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null); 
  const [aiModal, setAiModal] = useState({ isOpen: false, isLoading: false, text: "", title: "" });
  
  const { data: session, status } = useSession();
  const isLoaded = status !== "loading";
  const isSignedIn = !!session;

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
          className="fixed top-6 left-6 z-[110] bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 p-4 rounded-full text-[#111] dark:text-white hover:scale-105 transition-transform shadow-lg"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <EditorialArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
        <AiSummaryModal state={aiModal} setState={setAiModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#050505] text-[#111] dark:text-[#ededed] font-sans transition-colors duration-500 overflow-x-hidden">
      <EditorialBackground />
      <PremiumNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && <EditorialFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
        
        {activeTab === 'For You' && (
          <motion.div key="foryou" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-screen relative z-10">
            <h1 className="text-4xl font-serif font-black italic text-black/30 dark:text-white/30">Algorithm Booting...</h1>
          </motion.div>
        )}
        
        {activeTab === 'Jeevan AI' && (
          <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-screen relative z-10">
            <h1 className="text-4xl font-serif font-black italic text-black/30 dark:text-white/30">AI Chat Initializing...</h1>
          </motion.div>
        )}
        
        {activeTab === 'Profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen pb-32 px-6 relative z-10">
            {!isLoaded ? (
              <h1 className="text-2xl text-black/50 dark:text-white/50">Loading Profile...</h1>
            ) : !isSignedIn ? (
              <div className="text-center space-y-8 max-w-md w-full bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-12 rounded-none shadow-2xl">
                <div className="w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon size={32} className="text-[#111] dark:text-white" />
                </div>
                <h2 className="text-4xl font-black font-serif">Join Jeevan</h2>
                <p className="text-black/60 dark:text-white/60 text-sm leading-relaxed">Sign in to curate your editorial feed, save your favorite pieces, and access premium AI features.</p>
                <button onClick={() => signIn()} className="w-full bg-[#111] dark:bg-white text-white dark:text-black py-4 font-bold tracking-widest uppercase text-sm hover:opacity-80 transition-opacity">
                  Sign In / Sign Up
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md mx-auto flex flex-col items-center bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 p-12 rounded-none shadow-2xl">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Profile" className="w-28 h-28 rounded-full mb-6 border-4 border-[#f7f7f5] dark:border-[#050505] shadow-xl" />
                ) : (
                  <div className="w-28 h-28 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <UserIcon size={40} className="text-[#111] dark:text-white" />
                  </div>
                )}
                <h2 className="text-3xl font-black mb-2 font-serif">{session.user?.name || "Jeevan User"}</h2>
                <p className="text-black/60 dark:text-white/60 text-sm font-medium mb-10">{session.user?.email}</p>
                <button onClick={() => signOut()} className="w-full py-3 px-8 border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors font-bold tracking-widest uppercase text-sm">
                  Sign Out
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AiSummaryModal state={aiModal} setState={setAiModal} />
    </div>
  );
}

// ==========================================
// AI SUMMARY MODAL
// ==========================================
const AiSummaryModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-sm" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative w-full max-w-lg bg-[#f7f7f5] dark:bg-[#050505] border border-black/20 dark:border-white/20 p-8 shadow-2xl rounded-none">
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-4 right-4 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors p-2"><X size={20}/></button>
        
        <div className="flex items-center gap-3 mb-6 pr-8 border-b border-black/10 dark:border-white/10 pb-4">
          <BookOpen size={24} className="text-[#111] dark:text-[#ededed]" />
          <div>
            <h3 className="font-bold text-lg font-serif italic">Editor's Summary</h3>
            <p className="text-xs text-black/50 dark:text-white/50 line-clamp-1 uppercase tracking-widest">{state.title}</p>
          </div>
        </div>
        
        <div className="min-h-[150px] flex items-center justify-center">
          {state.isLoading ? (
             <div className="flex flex-col items-center justify-center space-y-4 py-4">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-[#111] dark:border-t-white rounded-full" />
               <p className="text-sm font-medium tracking-widest uppercase text-black/50 dark:text-white/50">Analyzing text...</p>
             </div>
          ) : (
             <div className="text-[#111] dark:text-[#ededed] text-sm md:text-base leading-relaxed w-full font-serif">
               <AnimatedParagraph text={state.text} />
             </div>
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [article]);

  const isEnglishAvailable = !!article.englishBody;
  const showEnglish = language === 'EN' && isEnglishAvailable;
  const currentTitle = showEnglish ? article.englishTitle : article.title;
  const currentBody = showEnglish ? article.englishBody : article.body;
  
  const ui = {
    tag: language === 'AS' ? 'দৃষ্টিকোণ • ৫ মিনিটৰ পঠন' : 'Perspective • 5 Min Read',
    authorPrefix: language === 'AS' ? 'ড°' : 'Dr.',
    location: language === 'AS' ? 'গুৱাহাটী' : 'Guwahati',
    aiTitle: language === 'AS' ? 'জীৱন সাৰাংশ' : 'Executive Summary',
    aiButton: language === 'AS' ? 'সাৰাংশ পঢ়ক' : 'Read Summary',
    missingTrans: language === 'AS' ? '' : 'English translation coming soon. Displaying original text.'
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#050505] text-[#111] dark:text-[#ededed] font-sans overflow-hidden relative pb-32 z-10 transition-colors duration-500">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-[#111] dark:bg-white origin-left z-[100]" />
      
      <div className="fixed top-6 right-6 md:top-8 md:right-10 z-50">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 p-1.5 rounded-full flex items-center shadow-lg">
          <button onClick={() => setLanguage('AS')} className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-colors ${language === 'AS' ? 'text-[#f7f7f5] dark:text-[#050505]' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}>
            {language === 'AS' && <motion.div layoutId="langPill" className="absolute inset-0 bg-[#111] dark:bg-white rounded-full" />}
            <span className="relative z-10 flex items-center gap-2">অসমীয়া</span>
          </button>
          <button onClick={() => setLanguage('EN')} className={`relative px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-colors ${language === 'EN' ? 'text-[#f7f7f5] dark:text-[#050505]' : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'}`}>
            {language === 'EN' && <motion.div layoutId="langPill" className="absolute inset-0 bg-[#111] dark:bg-white rounded-full" />}
            <span className="relative z-10">English</span>
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-28 md:py-32 relative z-10">
        <AnimatePresence>
          {language === 'EN' && !isEnglishAvailable && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-black/5 dark:bg-white/5 border border-black/20 dark:border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-widest mb-6 inline-block">{ui.missingTrans}</motion.div>
          )}
        </AnimatePresence>
        
        <span className="font-bold tracking-widest uppercase text-xs mb-8 block text-black/50 dark:text-white/50 border-b border-black/10 dark:border-white/10 pb-4">{ui.tag}</span>
        
        <div className="overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            <motion.h1 ref={titleRef} key={currentTitle} className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight font-serif italic text-[#111] dark:text-[#ededed]">{currentTitle}</motion.h1>
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="flex items-center gap-4 mt-12 mb-12 border-y border-black/10 dark:border-white/10 py-8">
          <div className="w-14 h-14 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
             <span className="font-serif font-black text-xl italic">{ui.authorPrefix}</span>
          </div>
          <div>
            <h4 className="font-bold text-xl font-serif uppercase tracking-wider">{article.authorName || 'Guest Author'}</h4>
            <p className="text-black/50 dark:text-white/50 text-sm font-medium tracking-widest uppercase mt-1">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'} • {ui.location}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-8 mb-16 rounded-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-xl font-serif italic mb-2 flex items-center gap-2"><BookOpen size={18}/> {ui.aiTitle}</h3>
            <p className="text-black/60 dark:text-white/60 text-sm">
              {language === 'AS' ? 'এই প্ৰবন্ধটোৰ মূল সাৰাংশ জানিবলৈ বুটামটো টিপক।' : 'Get a quick intelligent summary and key takeaways.'}
            </p>
          </div>
          <button onClick={() => onSummarize(article)} className="shrink-0 px-8 py-4 bg-[#111] dark:bg-white text-[#f7f7f5] dark:text-[#050505] font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform flex items-center gap-2">
            {ui.aiButton} <ArrowRight size={14} />
          </button>
        </motion.div>

        <div className="space-y-10 text-black/80 dark:text-white/80 text-lg md:text-xl leading-relaxed font-serif">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {currentBody?.map((block: any, index: number) => {
                const text = block.children?.[0]?.text;
                return <p key={index} className="mb-6">{text}</p>;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}