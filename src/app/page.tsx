// pages/index.tsx
'use client'
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import background from '../static/background.png';
import dynamic from 'next/dynamic';
const NewsSourceSelector = dynamic(() => import('@/components/NewsSourceSelector'));
import NewsList from '@/components/NewsList';


export default function Home() {
  const [source, setSource] = useState<string | null>(null);

  const newsListRef = useRef<HTMLDivElement>(null);

  const handleSelectSource = (selectedSource: string) => {
    if(source === selectedSource) return;
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
            key={source} // 強制讓 NewsList 隨 source 重新掛載
            source={source || ''}
          />

        </div>
      </main>
    </div>
  );
}
