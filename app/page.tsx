'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { Sparkles, ArrowRight, Globe, Bot } from 'lucide-react';
import { client } from '../sanity/lib/client'; 

export default function LiquidArticle() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [article, setArticle] = useState<any>(null);
  const [language, setLanguage] = useState<'AS' | 'EN'>('AS');

  // Framer Motion Scroll Physics
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

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

  if (!article) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <span className="text-blue-500 font-bold animate-pulse tracking-widest uppercase text-sm">
          Generating Cinematic Experience...
        </span>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#030303] text-white font-sans overflow-hidden selection:bg-blue-500/30 relative">
      
      {/* 1. LIQUID SCROLL PROGRESS BAR */}
      <motion.div 
        style={{ scaleX }} 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-500 origin-left z-[100]" 
      />

      {/* 2. SPATIAL PARALLAX GLOW */}
      <motion.div 
        style={{ y: glowY }}
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" 
      />
      
      {/* THE CINEMATIC TOGGLE SWITCH */}
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

      {/* CHANGED: max-w-3xl for a premium, focused reading experience */}
      <main className="max-w-3xl mx-auto px-6 py-28 md:py-32 relative z-10">
        
        <AnimatePresence>
          {language === 'EN' && !isEnglishAvailable && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-3 rounded-xl text-sm font-medium mb-6 inline-block backdrop-blur-md">
              {ui.missingTrans}
            </motion.div>
          )}
        </AnimatePresence>

        <span className="text-blue-500 font-bold tracking-widest uppercase text-xs mb-6 block transition-colors duration-500">
          {ui.tag}
        </span>
        
        <div className="overflow-hidden pb-4">
          <AnimatePresence mode="wait">
            <motion.h1 key={currentTitle} initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50">
              {currentTitle}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Author Info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.6 }} className="flex items-center gap-4 mt-8 mb-10 border-y border-white/10 py-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 p-[2px] flex-shrink-0">
             <div className="w-full h-full bg-[#030303] rounded-full flex items-center justify-center">
               <span className="font-bold text-sm">{ui.authorPrefix}</span>
             </div>
          </div>
          <div>
            <h4 className="font-bold text-lg">{article.authorName || 'Guest Author'}</h4>
            <p className="text-gray-500 text-sm">
              {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Published'} • {ui.location}
            </p>
          </div>
        </motion.div>

        {/* ======================================================== */}
        {/* INLINE JEEVAN AI BOX (Ready for future Gemini Integration) */}
        {/* ======================================================== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.8, duration: 0.6 }} 
          className="w-full bg-blue-900/10 border border-blue-500/20 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-12 relative overflow-hidden group"
        >
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <Bot className="text-blue-400" size={24} />
              </div>
              <h3 className="font-bold text-white text-xl flex items-center gap-2">
                {ui.aiTitle} <Sparkles className="text-emerald-400" size={16} />
              </h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                {language === 'AS' ? (
                  <p>এই প্ৰবন্ধটো পঢ়াৰ আগতে, জীৱন AI-ৰ জৰিয়তে ইয়াৰ মূল সাৰাংশ আৰু গুৰুত্বপূৰ্ণ দিশসমূহ জানিবলৈ তলৰ বুটামটো টিপক।</p>
                ) : (
                  <p>Before diving into the article, get a quick intelligent summary and key takeaways generated by Jeevan AI.</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Future Trigger for Gemini API */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {ui.aiButton} <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
        {/* ======================================================== */}

        {/* Article Body Content */}
        <div className="space-y-8 text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
          <AnimatePresence mode="wait">
            <motion.div key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {currentBody?.map((block: any, index: number) => (
                <motion.p 
                  key={index}
                  initial={{ opacity: 0, y: 40, filter: 'blur(5px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {block.children?.[0]?.text}
                </motion.p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>
    </div>
  );
}