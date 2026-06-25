'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Globe, Bot, Home, User, Zap } from 'lucide-react';
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
// NEW: AESTHETIC HOME FEED COMPONENT
// ==========================================
const HomeFeed = ({ setReadingArticle }: { setReadingArticle: (val: boolean) => void }) => {
  // Mock data - eventually we fetch this array from Sanity CMS
  const articles = [
    {
      id: 1,
      title: "The Future of AI in Daily Life",
      category: "Technology",
      readTime: "4 Min Read",
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Finding Peace in a Hyperconnected World",
      category: "Mindfulness",
      readTime: "6 Min Read",
      image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000&auto=format&fit=crop",
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-6 pt-24 pb-32 space-y-12"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Discover</h1>
        <Sparkles className="text-blue-500 animate-pulse" />
      </div>

      {articles.map((item, index) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.7, delay: index * 0.1 }}
          className="relative group cursor-pointer"
          onClick={() => setReadingArticle(true)} // Clicking opens the article
        >
          {/* THE GLOWING RUNNING BORDER */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500 group-hover:animate-pulse" />
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 z-0" />
          
          {/* CARD CONTENT */}
          <div className="relative z-10 bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/5 group-hover:border-transparent transition-colors duration-500">
            
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10" />
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Category Pill */}
              <div className="absolute top-4 left-4 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-xs font-bold text-white uppercase tracking-wider">{item.category}</span>
              </div>
            </div>

            {/* Text & Actions */}
            <div className="p-6 relative z-20 -mt-12">
              <span className="text-gray-400 text-xs font-medium mb-2 block">{item.readTime}</span>
              <AnimatedParagraph text={item.title} className="text-2xl font-bold text-white leading-tight mb-6" />
              
              <div className="flex items-center justify-between">
                {/* Read Article Button */}
                <span className="text-sm font-bold text-blue-400 flex items-center gap-2 group-hover:text-blue-300 transition-colors">
                  Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>

                {/* AI Summary Quick Action */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening the article
                    alert("AI Summary generation triggered!"); // We will build this next
                  }}
                  className="bg-blue-500/20 hover:bg-blue-500/40 p-2.5 rounded-xl border border-blue-500/30 transition-all text-blue-400 hover:text-white"
                >
                  <Zap size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ==========================================
// MAIN APP CONTAINER
// ==========================================
export default function AppContainer() {
  // This state controls which tab we are on from the BottomNav
  const [activeTab, setActiveTab] = useState('Home');
  // This state controls if we are reading a specific article
  const [readingArticle, setReadingArticle] = useState(false);

  // If reading an article, render the LiquidArticle component
  if (readingArticle) {
    return (
      <div className="relative">
        {/* Back Button */}
        <button 
          onClick={() => setReadingArticle(false)}
          className="fixed top-6 left-6 z-[110] bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <LiquidArticle />
      </div>
    );
  }

  // Otherwise, render the main App shell based on active nav tab
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-blue-500/30 relative">
      <AnimatePresence mode="wait">
        {activeTab === 'Home' && <HomeFeed key="home" setReadingArticle={setReadingArticle} />}
        {activeTab === 'For You' && <div key="foryou" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">For You Algorithm Booting...</h1></div>}
        {activeTab === 'Jeevan AI' && <div key="ai" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">Jeevan AI Initializing...</h1></div>}
        {activeTab === 'Profile' && <div key="profile" className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-gray-500 animate-pulse">Clerk Profile Loading...</h1></div>}
      </AnimatePresence>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

// ==========================================
// YOUR ORIGINAL LIQUID ARTICLE (Unchanged inside)
// ==========================================
function LiquidArticle() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [article, setArticle] = useState<any>(null);
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
    const fetchData = async () => {
      const query = `*[_type == "post"][0]{
        title, englishTitle, "authorName": author->name, publishedAt, body, englishBody
      }`;
      const data = await client.fetch(query);
      setArticle(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!article) return;
    if (titleRef.current) {
      gsap.fromTo(titleRef.current, 
        { y: 80, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
        { y: 0, opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.2, ease: 'power4.out', delay: 0.2 }
      );
    }
  }, [article]);

  if (!article) return <div className="min-h-screen bg-[#030303] flex items-center justify-center"><span className="text-blue-500 font-bold animate-pulse tracking-widest uppercase text-sm">Generating Cinematic Experience...</span></div>;

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