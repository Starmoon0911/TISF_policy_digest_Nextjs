// pages/index.tsx
'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import background from '../static/background.png';
import dynamic from 'next/dynamic';

const NewsSourceSelector = dynamic(() => import('@/components/NewsSourceSelector'));
import NewsList from '@/components/NewsList';

const newsData = [
  { 
    _id: "1", 
    title: "台灣宣布新的防疫政策", 
    date: new Date(), 
    source: "executive",
    desc: "台灣政府宣佈了新的防疫措施，旨在加強社區防疫，保護民眾健康。"
  },
  { 
    _id: "2", 
    title: "科技部推出最新科技計畫", 
    date: new Date(), 
    source: "education",
    desc: "科技部推出了新一代科技計畫，涵蓋AI、5G及生物科技等領域，推動產業發展。"
  },
  { 
    _id: "3", 
    title: "交通部宣布新建道路計畫", 
    date: new Date(), 
    source: "transport",
    desc: "交通部表示將在未來幾年內啟動多項新道路建設計畫，提升交通便利性。"
  },
  { 
    _id: "4", 
    title: "行政院通過新教育法案", 
    date: new Date(), 
    source: "executive",
    desc: "行政院通過了新教育法案，旨在提升教育品質，促進學生多元發展。"
  },
  { 
    _id: "5", 
    title: "內政部發布最新居住政策", 
    date: new Date(), 
    source: "executive",
    desc: "內政部發布新的居住政策，以改善住宅供應，促進城市平衡發展。"
  },
  { 
    _id: "6", 
    title: "經濟部推動創新經濟政策", 
    date: new Date(), 
    source: "education",
    desc: "經濟部宣布一系列創新政策，旨在激勵創新企業發展，推動經濟成長。"
  }
];

export default function Home() {
  const [source, setSource] = useState<string | null>(null);
  const newsListRef = useRef<HTMLDivElement>(null);

  const handleSelectSource = (selectedSource: string) => {
    setSource(selectedSource);
    if (newsListRef.current) {
      newsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative h-64 bg-gray-800 text-white flex items-center justify-center">
        <Image
          width={300}
          height={300}
          src={background}
          alt="政府新聞網站"
          className="absolute inset-0 object-cover w-full h-full opacity-70" />
        <h1 className="relative z-10 text-6xl font-bold">政聞導讀</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-4xl font-bold">請選擇新聞來源:</h1>
        <NewsSourceSelector onSelectSource={handleSelectSource} />
        
        {/* 添加 key 屬性，讓 NewsList 在每次篩選時重新渲染 */}
        <div ref={newsListRef}>
          <NewsList 
            key={source || 'all'} // 若 source 變更，key 值會改變
            data={newsData.filter(news => !source || news.source.includes(source))} 
          />
        </div>
      </main>
    </div>
  );
}
