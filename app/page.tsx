'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { 
  ArrowRight, Globe, User, X, Sun, Moon, 
  BookOpen, Bookmark, Sparkles, ChevronRight
} from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import { useSession, signIn, signOut } from 'next-auth/react';

// ==========================================
// 1. AESTHETIC BACKGROUND
// ==========================================
const AestheticBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 bg-[#EFEFE9] dark:bg-[#0A0A0A] transition-colors duration-700">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] dark:opacity-[0.03] mix-blend-multiply dark:mix-blend-overlay"></div>
  </div>
);

// ==========================================
// 2. FLOATING GLASS NAVIGATION
// ==========================================
const FloatingNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const navY = useTransform(scrollY, [0, 100], [0, -100]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    
    return scrollY.onChange((latest) => {
      const previous = scrollY.getPrevious();
      if (latest > 150 && latest > previous!) setHidden(true);
      else setHidden(false);
    });
  }, [scrollY]);

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

  return (
    <motion.nav 
      variants={{ visible: { y: 0 }, hidden: { y: "-150%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4"
    >
      <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl border border-black/5 dark:border-white/5 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]">
        
        <div onClick={() => setActiveTab('Frontpage')} className="font-serif text-2xl font-black italic tracking-tighter cursor-pointer text-[#111] dark:text-white pr-4 border-r border-black/10 dark:border-white/10">
          J<span className="text-[#D92B2B]">.</span>
        </div>

        <div className="flex items-center gap-6 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
          {['Frontpage', 'Discover', 'Archive'].map((tab) => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`transition-colors ${activeTab === tab ? 'text-[#D92B2B]' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-black/10 dark:border-white/10">
          {mounted && (
            <button onClick={toggleTheme} className="text-black/60 dark:text-white/60 hover:text-[#D92B2B] transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          <button onClick={() => setActiveTab('Profile')} className="text-black/60 dark:text-white/60 hover:text-[#D92B2B] transition-colors">
            <User size={16} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

// ==========================================
// 3. AVANT-GARDE HERO SECTION
// ==========================================
const AvantGardeHero = ({ featuredArticle }: { featuredArticle: any }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden">
      {/* Massive Background Typography */}
      <motion.div style={{ y: y1 }} className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-[0.02] pointer-events-none overflow-hidden z-0">
        <h1 className="text-[20vw] font-black font-serif italic whitespace-nowrap">JEEVAN</h1>
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
            <span className="inline-block py-1 px-3 border border-black/20 dark:border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 text-[#D92B2B]">
              Issue 01 • The Renaissance
            </span>
            <h1 className="text-6xl md:text-8xl font-black font-serif leading-[0.9] tracking-tighter mb-8 text-[#111] dark:text-[#ededed]">
              Culture, <br/>
              <span className="italic text-black/40 dark:text-white/40">Redefined.</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-black/60 dark:text-white/60 max-w-md mb-10 leading-relaxed">
              Immerse yourself in modern Assamese literature, striking visuals, and thought-provoking perspectives.
            </p>
          </motion.div>
        </div>

        {/* Featured Image Parallax Card */}
        {featuredArticle && (
          <motion.div style={{ y: y2 }} className="lg:col-span-7 relative group cursor-pointer w-full h-[60vh] md:h-[75vh] rounded-3xl overflow-hidden shadow-2xl">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }} className="w-full h-full">
              <img src={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000"} alt="Featured" className="w-full h-full object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <span className="text-[#D92B2B] text-xs font-bold uppercase tracking-widest mb-3 block drop-shadow-md">Cover Story</span>
              <h2 className="text-3xl md:text-5xl font-black text-white font-serif italic leading-tight line-clamp-2">{featuredArticle.title}</h2>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. ASYMMETRICAL GRID FEED
// ==========================================
const DynamicFeed = ({ articles, onRead, onSummarize }: { articles: any[], onRead: (a: any) => void, onSummarize: (a: any, e: React.MouseEvent) => void }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full relative z-10 pb-32">
      <AvantGardeHero featuredArticle={articles[0]} />

      <div className="max-w-7xl mx-auto px-6 mt-20">
        <div className="flex items-center justify-between mb-16">
          <h3 className="font-serif text-4xl md:text-5xl font-black italic tracking-tighter">Latest.</h3>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {articles.slice(1).map((item, index) => (
            <motion.div 
              key={item._id || index} 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="break-inside-avoid mb-8 group cursor-pointer" 
              onClick={() => onRead(item)}
            >
              <div className="relative w-full overflow-hidden rounded-2xl mb-6 bg-black/5 dark:bg-white/5">
                <motion.img 
                  whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: "easeOut" }} 
                  src={item.imageUrl} alt={item.title} 
                  className={`w-full object-cover ${index % 3 === 0 ? 'h-[400px]' : index % 2 === 0 ? 'h-[300px]' : 'h-[500px]'}`} 
                />
              </div>
              <div className="px-2">
                <span className="text-[#D92B2B] text-[10px] font-bold uppercase tracking-widest mb-3 block">{item.category || "Editorial"}</span>
                <h4 className="text-2xl md:text-3xl font-black font-serif leading-[1.1] mb-4 group-hover:text-[#D92B2B] transition-colors">{item.title}</h4>
                <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                  <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase tracking-widest">By {item.authorName || "Editorial"}</span>
                  <button onClick={(e) => onSummarize(item, e)} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-[#D92B2B] hover:text-white transition-colors group/btn">
                     <Sparkles size={14} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
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
  const [activeTab, setActiveTab] = useState('Frontpage');
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
      if (res.ok && data.summary) setAiModal({ isOpen: true, isLoading: false, text: data.summary, title: article.title });
      else setAiModal({ isOpen: true, isLoading: false, text: `ERROR: Failed to generate summary.`, title: article.title });
    } catch (error: any) {
       setAiModal({ isOpen: true, isLoading: false, text: `NETWORK ERROR`, title: article.title });
    }
  };

  if (selectedArticle) {
    return (
      <div className="relative">
        <button onClick={() => setSelectedArticle(null)} className="fixed top-8 left-6 md:left-12 z-[110] bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/10 dark:border-white/10 w-12 h-12 rounded-full flex items-center justify-center hover:-translate-x-2 transition-transform shadow-lg">
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} />
        <AestheticArticle article={selectedArticle} onSummarize={handleGenerateSummary} />
        <EditorDigestModal state={aiModal} setState={setAiModal} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFEFE9] dark:bg-[#0A0A0A] text-[#111] dark:text-[#ededed] font-sans transition-colors duration-700 overflow-x-hidden selection:bg-[#D92B2B]/30">
      <AestheticBackground />
      <FloatingNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <AnimatePresence mode="wait">
        {activeTab === 'Frontpage' && <DynamicFeed key="home" articles={articles} onRead={setSelectedArticle} onSummarize={handleGenerateSummary} />}
        
        {activeTab === 'Discover' && (
          <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6 text-center">
            <h1 className="text-5xl md:text-8xl font-serif font-black italic tracking-tighter mb-6">Discover.</h1>
            <p className="text-black/50 dark:text-white/50 font-medium max-w-md">Our algorithm is currently curating a personalized aesthetic feed for you.</p>
          </motion.div>
        )}
        
        {activeTab === 'Archive' && (
          <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6 text-center">
            <h1 className="text-5xl md:text-8xl font-serif font-black italic tracking-tighter mb-6">The Archive.</h1>
            <p className="text-black/50 dark:text-white/50 font-medium max-w-md">Search through years of literary history. Feature coming soon.</p>
          </motion.div>
        )}

        {activeTab === 'Profile' && (
          <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center min-h-screen px-6 relative z-10">
            <div className="w-full max-w-md bg-white/50 dark:bg-black/50 backdrop-blur-2xl border border-black/10 dark:border-white/10 p-12 rounded-3xl shadow-2xl text-center">
              {!isLoaded ? (
                <p className="animate-pulse font-bold uppercase tracking-widest text-xs">Loading...</p>
              ) : !isSignedIn ? (
                <>
                  <h2 className="text-4xl font-black font-serif italic mb-4">Join Us.</h2>
                  <p className="text-black/50 dark:text-white/50 text-sm mb-10">Sign in to save articles, sync preferences, and access the Editor's Digest.</p>
                  <button onClick={() => signIn()} className="w-full bg-[#111] dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:scale-[1.02] transition-transform shadow-xl">
                    Authenticate
                  </button>
                </>
              ) : (
                <>
                  {session.user?.image ? (
                    <img src={session.user.image} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-6 shadow-xl" />
                  ) : (
                    <div className="w-24 h-24 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6"><User size={32} /></div>
                  )}
                  <h2 className="text-3xl font-black font-serif italic mb-2">{session.user?.name}</h2>
                  <p className="text-[#D92B2B] text-xs font-bold uppercase tracking-widest mb-10">{session.user?.email}</p>
                  <button onClick={() => signOut()} className="w-full py-4 rounded-xl border border-black/20 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 font-bold tracking-widest uppercase text-xs transition-colors">
                    Sign Out
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
// AI SUMMARY MODAL
// ==========================================
const EditorDigestModal = ({ state, setState }: { state: any, setState: any }) => {
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md" onClick={() => setState({ ...state, isOpen: false })} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-[#EFEFE9] dark:bg-[#111] rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden border border-black/10 dark:border-white/10">
        <button onClick={() => setState({ ...state, isOpen: false })} className="absolute top-6 right-6 text-black/50 hover:text-[#D92B2B] transition-colors bg-black/5 dark:bg-white/5 p-2 rounded-full"><X size={20}/></button>
        
        <div className="mb-8">
          <div className="w-12 h-12 bg-[#D92B2B]/10 rounded-2xl flex items-center justify-center mb-6 text-[#D92B2B]"><Sparkles size={24} /></div>
          <h3 className="font-black text-3xl font-serif italic mb-2">Key Insights</h3>
          <p className="text-xs text-black/50 dark:text-white/50 uppercase tracking-widest font-bold line-clamp-1">{state.title}</p>
        </div>
        
        <div className="min-h-[150px]">
          {state.isLoading ? (
             <div className="flex flex-col items-center justify-center space-y-4 py-8">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-2 border-black/10 dark:border-white/10 border-t-[#D92B2B] rounded-full" />
             </div>
          ) : (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#111] dark:text-[#ededed] text-base leading-relaxed font-medium bg-white/50 dark:bg-black/20 p-6 rounded-2xl border border-black/5 dark:border-white/5">
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
    <div className="min-h-screen pt-32 pb-32 z-10">
      <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 h-1 bg-[#D92B2B] origin-left z-[100]" />
      
      <div className="max-w-4xl mx-auto px-6 mb-12 flex justify-end">
        <div className="bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full p-1 border border-black/10 dark:border-white/10 flex">
          <button onClick={() => setLanguage('AS')} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${language === 'AS' ? 'bg-[#111] dark:bg-white text-white dark:text-black shadow-md' : 'text-black/50 dark:text-white/50'}`}>AS</button>
          <button onClick={() => setLanguage('EN')} className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${language === 'EN' ? 'bg-[#111] dark:bg-white text-white dark:text-black shadow-md' : 'text-black/50 dark:text-white/50'}`}>EN</button>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6">
        <span className="inline-block py-1 px-3 bg-[#D92B2B]/10 text-[#D92B2B] rounded-full text-[10px] font-bold uppercase tracking-widest mb-8">
          {language === 'AS' ? 'প্ৰবন্ধ' : 'Perspective'}
        </span>
        
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter font-serif mb-12">
           {currentTitle}
        </motion.h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-y border-black/10 dark:border-white/10 mb-16">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center"><User size={16}/></div>
             <div>
               <h4 className="font-bold text-sm uppercase tracking-widest mb-1">{article.authorName || 'Guest Writer'}</h4>
               <p className="text-black/40 dark:text-white/40 text-[10px] font-bold tracking-widest uppercase">{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'}</p>
             </div>
          </div>
          <button onClick={() => onSummarize(article)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-black/5 dark:bg-white/5 hover:bg-[#D92B2B] hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group">
            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" /> Quick Insights
          </button>
        </div>

        <div className="space-y-8 text-black/80 dark:text-white/80 text-lg md:text-xl leading-[1.9] font-medium">
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