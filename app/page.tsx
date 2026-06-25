'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Globe, Bot, Zap, Home, User } from 'lucide-react';
import { client } from '../sanity/lib/client'; 
import BottomNav from './BottomNav';

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
// AESTHETIC HOME FEED COMPONENT (Now uses REAL Sanity Data)
// ==========================================
const HomeFeed = ({ articles, onRead }: { articles: any[], onRead: (article: any) => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-6 pt-24 pb-32 space-y-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-black text-white tracking-tight">Discover</h1>
        <Sparkles className="text-blue-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((item, index) => (
          <motion.div 
            key={item._id || index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            // THINNER BORDER: p-[1px] makes it sleek and sharp
            className="relative group cursor-pointer rounded-3xl overflow-hidden p-[1px] h-full flex flex-col"
            onClick={() => onRead(item)}
          >
            {/* 1. THE INSTAGRAM-VIBE SNAKE BORDER (Emerald -> Blue -> Purple) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250%] h-[250%] bg-[conic-gradient(from_0deg,transparent_40%,#10b981_60%,#3b82f6_80%,#8b5cf6_100%)] opacity-60 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* 2. INNER CARD BACKGROUND */}
            <div className="relative z-10 bg-[#0a0a0a] rounded-[calc(1.5rem-1px)] h-full overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              
              <div className="relative h-56 w-full overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent z-10" />
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  // Uses Sanity Image if it exists, otherwise uses a cool fallback
                  src={item.imageUrl || "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop"} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <span className="text-[10px] font-bold text-gray-200 uppercase tracking-wider">
                    {item.category || "Article"}
                  </span>
                </div>
              </div>

              <div className="p-6 relative z-20 flex-1 flex flex-col justify-between -mt-8">
                <div>
                  <AnimatedParagraph text={item.title} className="text-xl font-bold text-white leading-tight mb-6" />
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-bold text-gray-400 flex items-center gap-2 group-hover:text-white transition-colors">
                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>

                  {/* GLOWING AI BUTTON: Mini Snake & Drop Shadow added */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      alert("Jeevan AI Summary generation triggered!"); 
                    }}
                    className="relative overflow-hidden p-[1px] rounded-xl group/btn shrink-0"
                  >
                    {/* The Mini Button Snake */}
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
                      className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_50%,#3b82f6_100%)] opacity-80" 
                    />
                    {/* Button Inside */}
                    <div className="relative z-10 bg-[#0a0a0a] hover:bg-blue-900/40 p-2.5 rounded-[11px] transition-colors flex items-center justify-center">
                      <Zap size={18} className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.9)] group-hover/btn:animate-pulse" />
                    </div>
                  </button>

                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================
// MAIN APP CONTAINER (The Brains of the App)
// ==========================================
export default function AppContainer() {
  const [activeTab, setActiveTab] = useState('Home');
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null); // Holds the actual article clicked

  // 1. We fetch ALL articles from Sanity immediately when the app loads
  useEffect(() => {
    const fetchData = async () => {
      const query = `*[_type == "post"] | order(publishedAt desc) {
        _id, 
        title, 
        englishTitle, 
        "authorName": author->name, 
        publishedAt, 
        body, 
        englishBody,
        "imageUrl": mainImage.asset->url
      }`;
      const data = await client.fetch(query);
      setArticles(data);
    };
    fetchData();
  }, []);

  // 2. If a user clicks an article, we render the LiquidArticle and pass it the data directly
  if (selectedArticle) {
    return (
      <div className="relative">
        <button 
          onClick={() => setSelectedArticle(null)}
          className="fixed top-6 left-6 z-[110] bg-white/5 backdrop-blur-xl border border-white/10 p-3 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all shadow-xl"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        {/* Pass the real Sanity article down */}
        <LiquidArticle article={selectedArticle} />
      </div>
    );
  }

  // 3. Otherwise, show the Home Feed with the Sanity data
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-blue-500/30 relative">
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && <HomeFeed key="home" articles={articles} onRead={setSelectedArticle} />}
        {activeTab === 'For You' && <div key="foryou" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">For You Algorithm Booting...</h1></div>}
        {activeTab === 'Jeevan AI' && <div key="ai" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">Jeevan AI Initializing...</h1></div>}
        {activeTab === 'Profile' && <div key="profile" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">Clerk Profile Loading...</h1></div>}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// ==========================================
// YOUR ORIGINAL LIQUID ARTICLE (Now uses passed data!)
// ==========================================
function LiquidArticle({ article }: { article: any }) {
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
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative pb-32">
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
            <motion.button whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(59,130,246,0.5)" }} whileTap={{ scale: 0.96 }} className="relative overflow-hidden w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
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