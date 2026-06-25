'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Globe, Bot, Zap, Home, User as UserIcon, X, Compass, Flame } from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import BottomNav from './BottomNav';
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. LIVING BACKGROUND (Floating Neon Orbs)
// ==========================================
const LivingBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }} 
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
      className="absolute top-[10%] left-[10%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px]" 
    />
    <motion.div 
      animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1, 1.5, 1] }} 
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
      className="absolute bottom-[20%] right-[10%] w-[40rem] h-[40rem] bg-emerald-600/5 rounded-full blur-[150px]" 
    />
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
  </div>
);

// ==========================================
// Word-by-Word Living Text Component
// ==========================================
const AnimatedParagraph = ({ text, className = "" }: { text: string, className?: string }) => {
  if (!text) return null;
  const words = text.split(" ");
  
  return (
    <p className={`flex flex-wrap gap-[0.3em] ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.5, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

// ==========================================
// 2. HERO SECTION & INFINITE TICKER
// ==========================================
const HeroSection = () => {
  return (
    <div className="relative pt-32 pb-16 flex flex-col items-center justify-center text-center px-6 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }} 
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
        transition={{ duration: 1, ease: "easeOut" }} 
        className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]"
      >
        <Sparkles size={16} className="text-blue-400 animate-pulse" />
        <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">Welcome to the Next Generation</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 tracking-tight mb-6 leading-tight"
      >
        Experience <br/> 
        <motion.span animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-[length:200%_auto]">
          Jeevan Magazine
        </motion.span>
      </motion.h1>
      
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed">
        Read, discover, and interact with Assamese culture like never before, powered by cutting-edge AI.
      </motion.p>
    </div>
  );
};

const InfiniteTicker = () => (
  <div className="w-full overflow-hidden bg-white/5 border-y border-white/10 py-4 z-10 relative flex backdrop-blur-md mb-12">
    <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-12 text-sm font-bold tracking-widest uppercase text-gray-500 pr-12">
      {[...Array(8)].map((_, i) => (
        <span key={i} className="flex items-center gap-6">
          JEEVAN NEXTGEN <Sparkles size={14} className="text-blue-500 animate-pulse"/> 
          AI SUMMARIES <Zap size={14} className="text-emerald-500 animate-pulse"/> 
          AESTHETIC UI <Flame size={14} className="text-orange-500 animate-pulse"/>
        </span>
      ))}
    </motion.div>
  </div>
);

// ==========================================
// 3. ENHANCED AESTHETIC HOME FEED
// ==========================================
const HomeFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (article: any) => void, onSummarize: (article: any, e: React.MouseEvent) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10">
      <HeroSection />
      <InfiniteTicker />

      <div className="max-w-4xl mx-auto px-6 pb-32 space-y-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20"><Compass size={24} className="text-blue-400" /></div>
          <h2 className="text-3xl font-black text-white tracking-tight">Discover</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((item, index) => (
            <motion.div 
              key={item._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4 + (index % 3), repeat: Infinity, ease: "easeInOut" }}
              className="relative group cursor-pointer rounded-3xl overflow-hidden p-[3px] h-full flex flex-col"
              onClick={() => onRead(item)}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,transparent_40%,#10b981_60%,#3b82f6_80%,#8b5cf6_100%)] opacity-30 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,transparent_40%,#10b981_60%,#3b82f6_80%,#8b5cf6_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div whileHover={{ scale: 0.98 }} transition={{ duration: 0.4, ease: "easeOut" }} className="relative z-10 bg-[#0a0a0a]/90 backdrop-blur-xl rounded-[21px] h-full overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
                <div className="relative h-64 w-full overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent z-10" />
                  <motion.img whileHover={{ scale: 1.1 }} transition={{ duration: 0.8, ease: "easeOut" }} src={item.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">{item.category || "Article"}</span>
                  </div>
                </div>
                
                <div className="p-6 relative z-20 flex-1 flex flex-col justify-between -mt-12">
                  <div><AnimatedParagraph text={item.title} className="text-2xl font-bold text-white leading-tight mb-6" /></div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-gray-400 flex items-center gap-2 group-hover:text-white transition-colors">
                      Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    
                    <button onClick={(e) => onSummarize(item, e)} className="relative overflow-hidden p-[3px] rounded-xl group/btn shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,#3b82f6_100%)] opacity-100 blur-md" />
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,#3b82f6_100%)] opacity-100" />
                      <div className="relative z-10 bg-[#0a0a0a] group-hover/btn:bg-transparent p-2.5 rounded-[9px] transition-colors flex items-center justify-center">
                        <Zap size={20} className="text-blue-400 group-hover/btn:text-white transition-colors" />
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
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
      
      // THIS IS THE FIX: We now strictly catch the error Google sends back
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
        <button onClick={() => setSelectedArticle(null)} className="fixed top-6 left-6 z-[110] bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-xl">
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <LiquidArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
        <AiSummaryModal state={aiModal} setState={setAiModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-blue-500/30 relative overflow-x-hidden">
      <LivingBackground />
      
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && <HomeFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
        {activeTab === 'For You' && <div key="foryou" className="flex items-center justify-center min-h-screen relative z-10"><h1 className="text-2xl text-gray-500 animate-pulse">For You Algorithm Booting...</h1></div>}
        {activeTab === 'Jeevan AI' && <div key="ai" className="flex items-center justify-center min-h-screen relative z-10"><h1 className="text-2xl text-gray-500 animate-pulse">Jeevan AI Initializing...</h1></div>}
        
        {activeTab === 'Profile' && (
          <div key="profile" className="flex flex-col items-center justify-center min-h-screen pb-32 px-6 relative z-10">
            {!isLoaded ? (
              <h1 className="text-2xl text-gray-500 animate-pulse">Loading Profile...</h1>
            ) : !isSignedIn ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon size={32} className="text-blue-400" />
                </div>
                <h2 className="text-3xl font-black text-white">Join Jeevan</h2>
                <p className="text-gray-400 text-sm leading-relaxed">Sign in to sync your aesthetic feed, save your favorite articles, and chat with Jeevan AI.</p>
                <button onClick={() => signIn()} className="relative overflow-hidden p-[2px] rounded-xl group w-full mt-4 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,#3b82f6_100%)] opacity-100" />
                  <div className="relative z-10 bg-[#0a0a0a] group-hover:bg-blue-900/40 px-6 py-4 rounded-[10px] transition-colors flex items-center justify-center">
                    <span className="font-bold text-white tracking-wide">Sign In / Sign Up</span>
                  </div>
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md mx-auto flex flex-col items-center bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-0" />
                <div className="relative z-10 flex flex-col items-center">
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-24 h-24 rounded-full mb-6 border-4 border-[#0a0a0a] shadow-xl" />
                  ) : (
                    <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border-4 border-[#0a0a0a] shadow-xl">
                      <UserIcon size={40} className="text-blue-400" />
                    </div>
                  )}
                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{session.user?.name || "Jeevan User"}</h2>
                  <p className="text-blue-400 text-sm font-medium mb-8 px-4 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">{session.user?.email}</p>
                  <button onClick={() => signOut()} className="w-full py-3 px-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all font-bold tracking-wide">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      <AiSummaryModal state={aiModal} setState={setAiModal} />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// ==========================================
// AI SUMMARY MODAL COMPONENT
// ==========================================
const AiSummaryModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-[#0a0a0a] border border-blue-500/20 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"><X size={20}/></button>
        
        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="p-2.5 bg-blue-500/20 rounded-xl shrink-0"><Bot size={24} className="text-blue-400" /></div>
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">Jeevan AI Summary <Sparkles size={14} className="text-emerald-400" /></h3>
            <p className="text-xs text-gray-400 line-clamp-1">{state.title}</p>
          </div>
        </div>
        
        <div className="bg-blue-900/10 rounded-2xl p-6 min-h-[150px] border border-white/5 flex items-center justify-center">
          {state.isLoading ? (
             <div className="flex flex-col items-center justify-center space-y-4 py-4">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full" />
               <p className="text-sm text-blue-400 animate-pulse font-medium">Jeevan AI is reading the article...</p>
             </div>
          ) : (
             <div className="text-gray-200 text-sm md:text-base leading-relaxed w-full">
               <AnimatedParagraph text={state.text} />
             </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// LIQUID ARTICLE
// ==========================================
function LiquidArticle({ article, onSummarize }: { article: any, onSummarize: (article: any) => void }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [language, setLanguage] = useState<'AS' | 'EN'>('AS');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const mouseX = useSpring(0, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 50 });

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlightBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.15), transparent 80%)`;

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: 80, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { y: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.2, ease: 'power4.out', delay: 0.2 }
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
    aiTitle: language === 'AS' ? 'জীৱন AI সাৰাংশ' : 'Jeevan AI Summary',
    aiButton: language === 'AS' ? 'AI ৰ দ্বাৰা বিশ্লেষণ কৰক' : 'Analyze with Jeevan AI',
    missingTrans: language === 'AS' ? '' : 'English translation coming soon. Displaying original text.'
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative pb-32 z-10">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 origin-left z-[100]" />
      <motion.div style={{ y: glowY }} className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="fixed top-6 right-6 md:top-8 md:right-10 z-50">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-1.5 rounded-full flex items-center shadow-2xl">
          <button onClick={() => setLanguage('AS')} className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ${language === 'AS' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
            {language === 'AS' && <motion.div layoutId="activePill" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full" />}
            <span className="relative z-10 flex items-center gap-2"><Globe size={14} /> অসমীয়া</span>
          </button>
          <button onClick={() => setLanguage('EN')} className={`relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ${language === 'EN' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>
            {language === 'EN' && <motion.div layoutId="activePill" className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full" />}
            <span className="relative z-10 font-medium">English</span>
          </button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-28 md:py-32 relative z-10">
        <AnimatePresence>
          {language === 'EN' && !isEnglishAvailable && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-xl text-sm font-medium mb-6 inline-block backdrop-blur-md">{ui.missingTrans}</motion.div>
          )}
        </AnimatePresence>
        <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-6 block transition-colors duration-500">{ui.tag}</span>
        <div className="overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            <motion.h1 key={currentTitle} initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">{currentTitle}</motion.h1>
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex items-center gap-4 mt-8 mb-10 border-y border-white/10 py-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-[2px] flex-shrink-0">
             <div className="w-full h-full bg-[#030303] rounded-full flex items-center justify-center"><span className="font-bold text-sm">{ui.authorPrefix}</span></div>
          </div>
          <div>
            <h4 className="font-bold text-lg">{article.authorName || 'Guest Author'}</h4>
            <p className="text-gray-500 text-sm">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'} • {ui.location}</p>
          </div>
        </motion.div>

        <motion.div onPointerMove={handlePointerMove} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }} className="w-full bg-blue-900/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-50" />
          <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: spotlightBackground }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-xl"><Bot className="text-blue-400" size={24} /></div>
              <h3 className="font-bold text-white text-xl flex items-center gap-2">{ui.aiTitle} <Sparkles className="text-emerald-400" size={16} /></h3>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                {language === 'AS' ? <p>এই প্ৰবন্ধটো পঢ়াৰ আগতে, জীৱন AI-ৰ জৰিয়তে ইয়াৰ মূল সাৰাংশ আৰু গুৰুত্বপূৰ্ণ দিশসমূহ জানিবলৈ তলৰ বুটামটো টিপক।</p> : <p>Before diving into the article, get a quick intelligent summary and key takeaways generated by Jeevan AI.</p>}
              </motion.div>
            </AnimatePresence>
            <motion.button onClick={() => onSummarize(article)} whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.96 }} className="relative overflow-hidden w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
              <span className="relative z-10 flex items-center gap-2">{ui.aiButton} <ArrowRight size={18} /></span>
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {currentBody?.map((block: any, index: number) => {
                const text = block.children?.[0]?.text;
                return <AnimatedParagraph key={index} text={text} />;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}