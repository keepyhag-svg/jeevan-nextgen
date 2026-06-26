'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { 
  ArrowRight, User, X, Menu, Sun, Moon, 
  Terminal, Activity, ArrowUpRight, Database
} from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. RAW BRUTALIST BACKGROUND
// ==========================================
const BrutalistBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 bg-[#E5E5E5] dark:bg-[#0A0A0A] transition-colors duration-200">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-difference pointer-events-none"></div>
  </div>
);

// ==========================================
// 2. BULLETPROOF THEME TOGGLE & HEADER
// ==========================================
const BrutalHeader = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Bulletproof Dark Mode Logic
  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    const isDarkSet = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDarkSet) {
      root.classList.add('dark');
      setIsDark(true);
    } else {
      root.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navLinks = ['INDEX', 'SYSTEM_CURATED', 'DATABASE', 'ID_LOGIN'];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[90] bg-[#E5E5E5] dark:bg-[#0A0A0A] border-b-4 border-black dark:border-white flex items-center justify-between px-6 py-4 transition-colors duration-200">
        <div 
          onClick={() => setActiveTab('INDEX')}
          className="text-4xl md:text-5xl font-black tracking-tighter cursor-pointer text-black dark:text-white uppercase leading-none"
        >
          JEEVAN<span className="text-[#FF2A2A]">_</span>
        </div>
        
        <div className="flex items-center gap-4">
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="w-12 h-12 border-2 border-black dark:border-white flex items-center justify-center text-black dark:text-white bg-white dark:bg-black hover:bg-[#FF2A2A] hover:text-white dark:hover:bg-[#FF2A2A] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button 
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 border-2 border-black dark:border-white flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-[#FF2A2A] dark:hover:bg-[#FF2A2A] hover:text-white dark:hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Brutalist Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[150] bg-[#FF2A2A] flex flex-col p-6 text-black"
          >
            <div className="flex justify-between items-center w-full border-b-4 border-black pb-4">
              <h2 className="text-4xl font-black tracking-tighter">NAVIGATE_</h2>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-6 mt-16">
              {navLinks.map((link) => (
                <div key={link} className="overflow-hidden">
                  <motion.button 
                    initial={{ y: 100 }} animate={{ y: 0 }}
                    onClick={() => { setActiveTab(link); setIsOpen(false); }}
                    className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-left hover:pl-8 transition-all hover:text-white"
                  >
                    {link}
                  </motion.button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ==========================================
// 3. BRUTALIST HERO
// ==========================================
const BrutalHero = ({ featuredArticle }: { featuredArticle: any }) => {
  return (
    <div className="w-full pt-32 pb-12 px-6 border-b-4 border-black dark:border-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter uppercase text-black dark:text-white mb-8 break-words">
          ASSAM <br />
          <span className="text-transparent bg-clip-text" style={{ WebkitTextStroke: '2px currentColor' }}>UNCUT.</span>
        </h1>
        
        {featuredArticle && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-4 border-black dark:border-white bg-white dark:bg-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] p-4 md:p-8 relative">
            <div className="absolute top-0 right-0 bg-[#FF2A2A] text-black font-black uppercase tracking-widest text-xs py-2 px-4 border-l-4 border-b-4 border-black dark:border-white">
              LEAD_STORY
            </div>
            <div className="w-full h-[40vh] md:h-[50vh] border-2 border-black dark:border-white overflow-hidden">
              <img src={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"} alt="Featured" className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="flex flex-col justify-end pt-4">
              <h2 className="text-4xl md:text-5xl font-black leading-none tracking-tighter uppercase mb-6 text-black dark:text-white">{featuredArticle.title}</h2>
              <div className="flex items-center gap-4 mt-auto">
                <span className="bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs px-6 py-3 border-2 border-black dark:border-white hover:bg-[#FF2A2A] hover:text-black transition-colors">
                  READ_DATA
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. THE GRID
// ==========================================
const BrutalFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (a: any) => void, onSummarize: (a: any, e: React.MouseEvent) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 pb-32">
      <BrutalHero featuredArticle={articles[0]} />

      <div className="max-w-7xl mx-auto px-6 mt-16">
        <h3 className="text-5xl font-black tracking-tighter uppercase mb-8 text-black dark:text-white border-b-4 border-black dark:border-white pb-4">INDEX_</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(1).map((item, index) => (
            <div 
              key={item._id || index} 
              className="border-4 border-black dark:border-white bg-white dark:bg-[#111] p-4 flex flex-col group cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all" 
              onClick={() => onRead(item)}
            >
              <div className="w-full h-64 border-2 border-black dark:border-white mb-4 overflow-hidden relative">
                <div className="absolute top-2 left-2 bg-[#FF2A2A] text-black font-black text-[10px] uppercase px-2 py-1 border-2 border-black z-10">{item.category || "CULTURE"}</div>
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover grayscale contrast-150 group-hover:grayscale-0 transition-all duration-300" />
              </div>
              <h4 className="text-2xl font-black uppercase leading-none tracking-tighter mb-6 text-black dark:text-white">{item.title}</h4>
              
              <div className="mt-auto pt-4 border-t-4 border-black dark:border-white flex items-center justify-between">
                <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest">{item.authorName || "SYS_ADMIN"}</span>
                <button 
                  onClick={(e) => onSummarize(item, e)} 
                  className="bg-black dark:bg-white text-white dark:text-black p-2 hover:bg-[#FF2A2A] dark:hover:bg-[#FF2A2A] hover:text-black transition-colors"
                >
                  <Terminal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN APP CONTAINER
// ==========================================
export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('INDEX');
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
      setAiModal({ isOpen: true, isLoading: false, text: "ERR_NO_DATA", title: article.title });
      return;
    }

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      const data = await res.json();
      if (res.ok && data.summary) setAiModal({ isOpen: true, isLoading: false, text: data.summary, title: article.title });
      else setAiModal({ isOpen: true, isLoading: false, text: `SYS_ERR_FAILED`, title: article.title });
    } catch (error: any) {
       setAiModal({ isOpen: true, isLoading: false, text: `NET_ERR_DISCONNECT`, title: article.title });
    }
  };

  if (selectedArticle) {
    return (
      <div className="relative">
        <button onClick={() => setSelectedArticle(null)} className="fixed top-24 left-6 md:left-12 z-[110] bg-white dark:bg-black border-4 border-black dark:border-white w-14 h-14 flex items-center justify-center hover:bg-[#FF2A2A] hover:text-black text-black dark:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <ArrowRight size={24} className="rotate-180" />
        </button>
        <BrutalHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        <BrutalArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
        <SysTerminalModal state={aiModal} setState={setAiModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5E5E5] dark:bg-[#0A0A0A] text-black dark:text-white font-sans transition-colors duration-200 overflow-x-hidden selection:bg-[#FF2A2A] selection:text-black">
      <BrutalBackground />
      <BrutalHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        {activeTab === 'INDEX' && <BrutalFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
        
        {activeTab === 'SYSTEM_CURATED' && (
          <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6 text-center pt-20">
            <Activity size={64} className="mb-8 text-[#FF2A2A]" />
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 border-b-8 border-black dark:border-white pb-4">SYS_CURATED</h1>
            <p className="text-xl font-bold uppercase tracking-widest max-w-md">Algorithm compiling visual data.</p>
          </motion.div>
        )}
        
        {activeTab === 'DATABASE' && (
          <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6 text-center pt-20">
            <Database size={64} className="mb-8 text-black dark:text-white" />
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 border-b-8 border-black dark:border-white pb-4">DATABASE_</h1>
            <p className="text-xl font-bold uppercase tracking-widest max-w-md">Accessing historical records. Standby.</p>
          </motion.div>
        )}

        {activeTab === 'ID_LOGIN' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10 pt-20">
            <div className="w-full max-w-md bg-white dark:bg-[#111] border-4 border-black dark:border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] text-center relative">
              <div className="absolute top-0 left-0 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[10px] px-2 py-1">AUTH_REQ</div>
              {!isLoaded ? (
                <p className="animate-pulse font-black uppercase tracking-widest text-xl mt-8">PINGING_SERVER...</p>
              ) : !isSignedIn ? (
                <>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 mt-4">ID_LOGIN</h2>
                  <p className="text-black/60 dark:text-white/60 text-xs font-bold uppercase tracking-widest mb-10">Authenticate to access system terminal.</p>
                  <button onClick={() => signIn()} className="w-full bg-[#FF2A2A] text-black border-4 border-black dark:border-white py-4 font-black tracking-widest uppercase text-lg hover:bg-black hover:text-white transition-colors">
                    EXEC_LOGIN
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 border-4 border-black dark:border-white mx-auto mb-6 bg-[#E5E5E5] dark:bg-[#0A0A0A] overflow-hidden mt-4">
                     {session.user?.image ? <img src={session.user.image} alt="Profile" className="w-full h-full object-cover grayscale" /> : <User size={48} className="m-auto mt-4"/>}
                  </div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{session.user?.name}</h2>
                  <p className="text-[#FF2A2A] text-xs font-bold uppercase tracking-widest mb-10">{session.user?.email}</p>
                  <button onClick={() => signOut()} className="w-full py-4 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black hover:bg-[#FF2A2A] dark:hover:bg-[#FF2A2A] hover:text-black dark:hover:text-black font-black tracking-widest uppercase text-lg transition-colors">
                    SYS_LOGOUT
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// AI SUMMARY MODAL (Terminal)
// ==========================================
const SysTerminalModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative w-full max-w-2xl bg-black border-4 border-[#FF2A2A] p-6 sm:p-8 shadow-[12px_12px_0px_0px_rgba(255,42,42,0.4)]">
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-4 right-4 text-[#FF2A2A] hover:bg-[#FF2A2A] hover:text-black border-2 border-[#FF2A2A] p-1 transition-colors"><X size={20}/></button>
        
        <div className="mb-6 border-b-2 border-[#FF2A2A]/30 pb-4">
          <div className="flex items-center gap-2 text-[#FF2A2A] font-black uppercase tracking-widest text-xs mb-2">
            <Terminal size={14} /> SYS_TERMINAL_DATA_EXTRACT
          </div>
          <p className="text-white font-black uppercase tracking-tighter text-2xl line-clamp-1">{state.title}</p>
        </div>
        
        <div className="min-h-[150px] font-mono text-[#00FF41]">
          {state.isLoading ? (
             <div className="flex flex-col items-start space-y-2 py-4">
               <p className="animate-pulse">{'>'} INITIALIZING ALGORITHM...</p>
               <p className="animate-pulse" style={{animationDelay: '0.2s'}}>{'>'} PARSING DATASET...</p>
               <p className="animate-pulse" style={{animationDelay: '0.4s'}}>{'>'} STANDBY_</p>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#E5E5E5] text-sm leading-relaxed uppercase">
               <span className="text-[#FF2A2A] font-bold">{'>'} OUTPUT: </span><br/><br/>
               {state.text}
               <span className="animate-pulse inline-block w-2 h-4 bg-[#FF2A2A] ml-1 align-middle"></span>
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// BRUTALIST ARTICLE PAGE
// ==========================================
function BrutalArticle({ article, onSummarize }: { article: any, onSummarize: (article: any) => void }) {
  const [language, setLanguage] = useState<'AS' | 'EN'>('AS');
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isEnglishAvailable = !!article.englishBody;
  const showEnglish = language === 'EN' && isEnglishAvailable;
  const currentTitle = showEnglish ? article.englishTitle : article.title;
  const currentBody = showEnglish ? article.englishBody : article.body;

  return (
    <div className="min-h-screen pt-32 pb-32 z-10 bg-[#E5E5E5] dark:bg-[#0A0A0A]">
      <motion.div style={{ scaleX }} className="fixed top-[84px] left-0 right-0 h-2 bg-[#FF2A2A] origin-left z-[100]" />
      
      <div className="max-w-4xl mx-auto px-6 mb-12 flex justify-end">
        <div className="flex border-4 border-black dark:border-white bg-white dark:bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <button onClick={() => setLanguage('AS')} className={`px-6 py-2 text-xs font-black tracking-widest uppercase border-r-4 border-black dark:border-white transition-colors ${language === 'AS' ? 'bg-[#FF2A2A] text-black' : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'}`}>AS_</button>
          <button onClick={() => setLanguage('EN')} className={`px-6 py-2 text-xs font-black tracking-widest uppercase transition-colors ${language === 'EN' ? 'bg-[#FF2A2A] text-black' : 'text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10'}`}>EN_</button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6">
        <div className="bg-black dark:bg-white text-white dark:text-black inline-block px-4 py-1 font-black uppercase tracking-widest text-[10px] mb-6">
          DATA_LOG: {article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : 'UNKNOWN'}
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-none tracking-tighter uppercase mb-12 text-black dark:text-white break-words">
           {currentTitle}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y-4 border-black dark:border-white mb-16">
          <div className="flex flex-col">
               <h4 className="font-black text-xl uppercase tracking-tighter text-black dark:text-white">AUTH: {article.authorName || 'SYS_USER'}</h4>
          </div>
          <button onClick={() => onSummarize(article)} className="flex items-center gap-2 px-6 py-3 border-4 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-[#FF2A2A] dark:hover:bg-[#FF2A2A] hover:text-black dark:hover:text-black transition-colors text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <Terminal size={16} /> EXTRACT_DATA
          </button>
        </div>

        <div className="space-y-8 text-black dark:text-white text-xl md:text-2xl leading-snug font-bold">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {currentBody?.map((block: any, index: number) => {
                const text = block.children?.[0]?.text;
                return <p key={index} className="mb-8">{text}</p>;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}