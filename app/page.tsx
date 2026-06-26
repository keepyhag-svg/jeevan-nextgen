'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { 
  Sparkles, ArrowRight, Home, User, 
  X, Compass, PlayCircle, Zap, Moon, Sun, Flame
} from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. NEXT-GEN BACKGROUND (Midnight & Electric Violet)
// ==========================================
const CyberBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 bg-[#0B0B0C] transition-colors duration-500 light-mode:bg-[#F2F2F2]"></div>
    <motion.div 
      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} 
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} 
      className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#6200EE] rounded-full blur-[150px] mix-blend-screen opacity-30" 
    />
    <motion.div 
      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }} 
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
      className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#CCFF00] rounded-full blur-[150px] mix-blend-screen opacity-10" 
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
  </div>
);

// ==========================================
// 2. DYNAMIC BOTTOM DOCK
// ==========================================
const DynamicDock = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'Home', icon: Home, label: 'Feed' },
    { id: 'Explore', icon: Compass, label: 'Discover' },
    { id: 'Jeevan AI', icon: Sparkles, label: 'AI Hub' },
    { id: 'Profile', icon: User, label: 'ID' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className="bg-white/10 light-mode:bg-black/10 backdrop-blur-2xl border border-white/10 light-mode:border-black/10 p-2 rounded-[2rem] flex items-center gap-2 shadow-[0_0_40px_rgba(98,0,238,0.15)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${isActive ? 'text-black bg-[#CCFF00] shadow-[0_0_20px_rgba(204,255,0,0.4)]' : 'text-white/60 light-mode:text-black/60 hover:text-white light-mode:hover:text-black hover:bg-white/5'}`}
            >
              <Icon size={20} className={isActive ? 'animate-pulse' : ''} />
              {isActive && (
                <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} className="text-sm font-bold tracking-wide">
                  {tab.label}
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ==========================================
// 3. TOP NAVIGATION (For You Toggle)
// ==========================================
const TopNav = ({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
    <div className="text-2xl font-black tracking-tighter text-white light-mode:text-black">
      JEEVAN<span className="text-[#CCFF00]">.</span>
    </div>
    
    <div className="bg-white/5 light-mode:bg-black/5 backdrop-blur-xl border border-white/10 light-mode:border-black/10 rounded-full p-1 flex">
      <button className="px-4 py-1.5 rounded-full bg-[#6200EE] text-white text-xs font-bold shadow-[0_0_15px_rgba(98,0,238,0.5)]">For You</button>
      <button className="px-4 py-1.5 rounded-full text-white/50 light-mode:text-black/50 text-xs font-bold hover:text-white light-mode:hover:text-black transition-colors">Global</button>
    </div>

    <button 
      onClick={toggleTheme} 
      className="w-10 h-10 rounded-full bg-white/10 light-mode:bg-black/10 backdrop-blur-xl border border-white/10 light-mode:border-black/10 flex items-center justify-center text-white light-mode:text-black hover:bg-[#CCFF00] hover:text-black transition-all"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  </nav>
);

// ==========================================
// 4. BENTO BOX FEED
// ==========================================
const BentoFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (a: any) => void, onSummarize: (a: any, e: React.MouseEvent) => void }) => {
  return (
    <div className="w-full relative z-10 pt-32 pb-40 max-w-7xl mx-auto px-6">
      
      {/* Vibe Tags */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar mb-10 pb-4">
        {['#CoreCore', '#AssameseHeritage', '#CyberpunkRealism', '#PoetryDrops', '#HustleInfotainment'].map(tag => (
          <span key={tag} className="px-4 py-2 rounded-xl bg-white/5 light-mode:bg-black/5 backdrop-blur-md border border-white/10 light-mode:border-black/10 text-white/80 light-mode:text-black/80 text-xs font-bold whitespace-nowrap cursor-pointer hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Featured Hero Bento */}
        {articles[0] && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 md:row-span-2 relative group cursor-pointer rounded-[2rem] overflow-hidden border border-white/10 light-mode:border-black/10 shadow-2xl h-[50vh] md:h-auto"
            onClick={() => onRead(articles[0])}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-transparent z-10" />
            <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} src={articles[0].imageUrl} className="w-full h-full object-cover" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 z-20">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-lg bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.4)]">Hot Drop</span>
                <span className="text-white/80 text-xs font-bold flex items-center gap-1"><Flame size={14}/> Trending</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-4 group-hover:text-[#CCFF00] transition-colors">{articles[0].title}</h2>
              <div className="flex items-center justify-between mt-6">
                 <span className="text-white/60 text-sm font-medium">By {articles[0].authorName}</span>
                 <button onClick={(e) => onSummarize(articles[0], e)} className="p-3 bg-white/10 backdrop-blur-xl rounded-xl hover:bg-[#6200EE] transition-colors text-white">
                   <Zap size={20} />
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Smaller Bento Cards */}
        {articles.slice(1).map((item, index) => (
          <motion.div 
            key={item._id || index}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative group cursor-pointer rounded-[2rem] overflow-hidden border border-white/10 light-mode:border-black/10 bg-white/5 light-mode:bg-black/5 backdrop-blur-xl h-64 md:h-80 flex flex-col"
            onClick={() => onRead(item)}
          >
            <div className="h-1/2 w-full overflow-hidden relative">
              <motion.img whileHover={{ scale: 1.1 }} src={item.imageUrl} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-1 justify-between">
              <h3 className="text-xl font-bold text-white light-mode:text-black leading-tight line-clamp-3 group-hover:text-[#6200EE] transition-colors">{item.title}</h3>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-[#CCFF00] text-xs font-bold uppercase tracking-widest flex items-center gap-1">Read <ArrowRight size={14}/></span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP CONTAINER (With Local Theme State)
// ==========================================
export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('Home');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null); 
  const [aiModal, setAiModal] = useState({ isOpen: false, isLoading: false, text: "", title: "" });
  
  // Local theme state to bypass Next.js hydration issues entirely
  const [isDark, setIsDark] = useState(true); 
  
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
    if (!fullText) return setAiModal({ isOpen: true, isLoading: false, text: "No data available.", title: article.title });

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: fullText })
      });
      const data = await res.json();
      if (res.ok && data.summary) setAiModal({ isOpen: true, isLoading: false, text: data.summary, title: article.title });
      else setAiModal({ isOpen: true, isLoading: false, text: `ERROR: Failed to generate.`, title: article.title });
    } catch (error: any) {
       setAiModal({ isOpen: true, isLoading: false, text: `NETWORK ERROR`, title: article.title });
    }
  };

  if (selectedArticle) {
    return (
      <div className={isDark ? "dark" : "light-mode"}>
        <div className="relative min-h-screen bg-[#0B0B0C] light-mode:bg-[#F2F2F2] text-white light-mode:text-black transition-colors duration-500">
          <button onClick={() => setSelectedArticle(null)} className="fixed top-8 left-6 md:left-12 z-[110] bg-white/10 light-mode:bg-black/10 backdrop-blur-xl border border-white/20 light-mode:border-black/20 w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all">
            <ArrowRight size={20} className="rotate-180" />
          </button>
          <AestheticArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
          <AISliderModal state={aiModal} setState={setAiModal} />
        </div>
      </div>
    );
  }

  return (
    // We apply the theme class to a wrapper div to bypass HTML hydration bugs
    <div className={isDark ? "dark" : "light-mode"}>
      <div className="min-h-screen font-sans transition-colors duration-500 overflow-x-hidden text-white light-mode:text-black">
        <CyberBackground />
        <TopNav toggleTheme={() => setIsDark(!isDark)} isDark={isDark} />
        
        <AnimatePresence mode="wait">
          {activeTab === 'Home' && <BentoFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
          
          {activeTab === 'Explore' && (
            <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6 text-center">
              <PlayCircle size={64} className="mb-8 text-[#6200EE]" />
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Discover Hub</h1>
              <p className="text-lg font-medium text-white/60 light-mode:text-black/60 max-w-md">Micro-learning stories and immersive video content coming soon.</p>
            </motion.div>
          )}

          {activeTab === 'Profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
              <div className="w-full max-w-md bg-white/5 light-mode:bg-black/5 backdrop-blur-2xl border border-white/10 light-mode:border-black/10 p-10 rounded-[2rem] shadow-2xl text-center">
                {!isLoaded ? (
                  <p className="animate-pulse font-bold tracking-widest text-xs text-[#CCFF00]">Connecting to Web3...</p>
                ) : !isSignedIn ? (
                  <>
                    <h2 className="text-4xl font-black tracking-tighter mb-4">Digital Identity</h2>
                    <p className="text-white/60 light-mode:text-black/60 text-sm mb-10 leading-relaxed">Sign in to unlock your gamified reward loop, digital posters, and personalized shrine.</p>
                    <button onClick={() => signIn()} className="w-full bg-[#6200EE] text-white py-4 rounded-2xl font-bold tracking-widest uppercase text-xs hover:bg-[#CCFF00] hover:text-black hover:shadow-[0_0_20px_rgba(204,255,0,0.5)] transition-all">
                      Authenticate
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-full mx-auto mb-6 p-1 bg-gradient-to-tr from-[#6200EE] to-[#CCFF00]">
                       {session.user?.image ? <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full object-cover" /> : <div className="w-full h-full bg-black rounded-full flex items-center justify-center"><User size={32}/></div>}
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">{session.user?.name}</h2>
                    <p className="text-[#CCFF00] text-xs font-bold uppercase tracking-widest mb-10">{session.user?.email}</p>
                    <button onClick={() => signOut()} className="w-full py-4 rounded-2xl border border-white/20 light-mode:border-black/20 hover:bg-white/10 font-bold tracking-widest uppercase text-xs transition-colors">
                      Disconnect
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DynamicDock activeTab={activeTab} setActiveTab={setActiveTab} />
        <AISliderModal state={aiModal} setState={setAiModal} />
      </div>
    </div>
  );
}

// ==========================================
// AI TL;DR SLIDER (Next-Gen Modal)
// ==========================================
const AISliderModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div 
        initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-lg bg-[#0B0B0C]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_-20px_50px_rgba(98,0,238,0.2)] overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6200EE] to-[#CCFF00]" />
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 p-2 rounded-full"><X size={20}/></button>
        
        <div className="mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#CCFF00] rounded-2xl flex items-center justify-center text-black"><Sparkles size={24} /></div>
          <div>
            <h3 className="font-black text-2xl text-white">AI TL;DR</h3>
            <p className="text-xs text-white/50 font-bold tracking-widest uppercase line-clamp-1">{state.title}</p>
          </div>
        </div>
        
        <div className="min-h-[150px]">
          {state.isLoading ? (
             <div className="flex flex-col items-center justify-center py-10">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-10 h-10 border-4 border-white/10 border-t-[#CCFF00] rounded-full mb-4" />
               <p className="text-xs font-bold tracking-widest uppercase text-[#CCFF00] animate-pulse">Generating Summary...</p>
             </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/90 text-base leading-relaxed font-medium bg-white/5 p-6 rounded-2xl border border-white/5">
               {state.text}
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// AESTHETIC ARTICLE PAGE
// ==========================================
function AestheticArticle({ article, onSummarize }: { article: any, onSummarize: (article: any) => void }) {
  const [language, setLanguage] = useState<'AS' | 'EN'>('AS');
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isEnglishAvailable = !!article.englishBody;
  const showEnglish = language === 'EN' && isEnglishAvailable;
  const currentTitle = showEnglish ? article.englishTitle : article.title;
  const currentBody = showEnglish ? article.englishBody : article.body;

  return (
    <div className="min-h-screen pt-32 pb-40 z-10">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6200EE] to-[#CCFF00] origin-left z-[100]" />
      
      <main className="max-w-3xl mx-auto px-6">
        {/* The AI TL;DR Slider Toggle (Visual Concept) */}
        <div className="w-full bg-white/5 light-mode:bg-black/5 backdrop-blur-xl border border-white/10 light-mode:border-black/10 rounded-2xl p-2 mb-10 flex items-center justify-between">
           <div className="flex items-center gap-3 px-4">
             <Zap size={20} className="text-[#CCFF00]"/>
             <span className="font-bold text-sm">AI Quick Read</span>
           </div>
           <button onClick={() => onSummarize(article)} className="px-6 py-2 bg-[#6200EE] hover:bg-[#CCFF00] hover:text-black transition-colors rounded-xl text-white text-xs font-bold uppercase tracking-widest">
             Generate TL;DR
           </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tighter mb-10">
           {currentTitle}
        </h1>

        <div className="flex items-center justify-between pb-8 mb-10 border-b border-white/10 light-mode:border-black/10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6200EE] to-[#CCFF00] p-0.5">
               <div className="w-full h-full bg-[#0B0B0C] rounded-full flex items-center justify-center text-xs font-bold">AS</div>
             </div>
             <div>
               <h4 className="font-bold text-sm uppercase tracking-widest">{article.authorName || 'Guest Writer'}</h4>
               <p className="text-white/50 light-mode:text-black/50 text-[10px] font-bold tracking-widest uppercase">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</p>
             </div>
          </div>
          
          <div className="bg-white/10 light-mode:bg-black/10 rounded-full p-1 flex">
            <button onClick={() => setLanguage('AS')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${language === 'AS' ? 'bg-[#CCFF00] text-black shadow-lg' : 'text-white/50 light-mode:text-black/50'}`}>AS</button>
            <button onClick={() => setLanguage('EN')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${language === 'EN' ? 'bg-[#CCFF00] text-black shadow-lg' : 'text-white/50 light-mode:text-black/50'}`}>EN</button>
          </div>
        </div>

        <div className="space-y-8 text-white/90 light-mode:text-black/90 text-lg md:text-xl leading-[1.8] font-medium">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
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