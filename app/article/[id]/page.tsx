'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { client } from '../../../sanity/lib/client';
import Link from 'next/link';

export default function StandaloneArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      const query = `*[_type == "post" && _id == $id][0] {
        _id, title, "authorName": author->name, publishedAt, body, "imageUrl": mainImage.asset->url
      }`;
      const data = await client.fetch(query, { id: params.id });
      setArticle(data);
    };
    
    // Fallback if Sanity ID doesn't match
    if (params.id === '1' || params.id === '2' || params.id === '3') {
       setArticle({ _id: params.id, title: 'PALLADIO GROUP', authorName: 'KF ADV', publishedAt: '2026-05-13' });
    } else {
       fetchArticle();
    }
  }, [params.id]);

  if (!article) return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black font-serif text-2xl font-bold animate-pulse">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Premium Minimal Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
          <ArrowLeft size={16} /> Back to Magazine
        </Link>
        <div className="text-xl font-bold tracking-tighter font-serif">
          W<span className="text-gray-400">.</span>
        </div>
        <div className="flex gap-4">
          <button className="text-gray-400 hover:text-black transition-colors"><Share2 size={18} /></button>
          <button className="text-gray-400 hover:text-black transition-colors"><Bookmark size={18} /></button>
        </div>
      </nav>

      {/* Editorial Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div className="text-center font-medium text-xs text-gray-500 tracking-wider uppercase mb-6">
          Editorial Feature — {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'May 13, 2026'}
        </div>

        <h1 className="text-5xl md:text-7xl font-black font-serif text-center text-black tracking-tight uppercase leading-[0.9] mb-8">
          {article.title}
        </h1>

        <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 mb-16">
          <span className="text-gray-400">Written by</span> {article.authorName || 'KF ADV'} 
          <span className="bg-gray-100 text-[10px] px-2 py-0.5 rounded text-gray-500 border border-gray-200">PRO</span>
        </div>

        {/* Massive Hero Asset */}
        <div className="w-full aspect-video bg-gray-100 mb-16 overflow-hidden border border-gray-200">
          <img 
            src={article.imageUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-800 leading-relaxed font-medium mb-12 font-serif">
          {article.body?.[0]?.children?.[0]?.text || "Redefined its digital presence with a premium installation environment that blends structural heritage with structural design innovations."}
        </div>

        <div className="max-w-2xl mx-auto border-t border-dotted border-gray-300 pt-10 mt-10">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Project Taxonomy Tagging</div>
          <div className="flex flex-wrap gap-2">
            {['Architecture', 'Next.js', 'Luxury UI', 'Editorial', 'Web Design'].map(tag => (
              <span key={tag} className="px-4 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-800 bg-gray-50 hover:bg-black hover:text-white transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}