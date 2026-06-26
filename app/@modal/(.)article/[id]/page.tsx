'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { client } from '../../../../sanity/lib/client';

export default function ArticleModal({ params }: { params: { id: string } }) {
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

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/40 backdrop-blur-sm flex justify-end">
      <motion.div 
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} 
        transition={{ type: "tween", duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl bg-white min-h-screen shadow-2xl relative p-6 md:p-12"
      >
        <button onClick={() => router.back()} className="sticky top-6 float-right z-50 bg-black text-white p-3 hover:opacity-80 flex items-center justify-center">
          <X size={20} />
        </button>

        <div className="max-w-2xl mx-auto pt-12">
          <div className="text-center font-medium text-xs text-gray-500 tracking-wider uppercase mb-3">
            Honorable Mention
          </div>
          <h2 className="text-4xl md:text-5xl font-black font-serif text-center text-black tracking-tight uppercase leading-none mb-4">
            {article.title}
          </h2>
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 mb-10">
            <span className="text-gray-400">by</span> {article.authorName || 'KF ADV'}
          </div>
          <div className="w-full aspect-video bg-gray-100 mb-10 overflow-hidden border border-gray-200 rounded-lg">
            <img src={article.imageUrl || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809"} alt={article.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}