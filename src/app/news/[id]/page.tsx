'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

export default function NewsDetail() {
  const params = useParams();
  const { id } = params; // 獲取路由參數 `id`
  const [news, setNews] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/v1/news/executive?id=${id}`);

        if (response.status === 400) {
          setError('404');
          return;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data.data[0]);
        console.log(data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, [id]);

  if (error === '404') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-red-500">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">找不到您要的新聞</h2>
          <p className="mt-2 text-gray-600">
            很抱歉，您訪問的內容不存在。請檢查網址是否正確或返回首頁。
          </p>
          <button
            className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none"
            onClick={() => window.location.href = '/'}
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container mx-auto p-4">
        <p>正在載入新聞內容...</p>
      </div>
    );
  }
  const scrollElement = document.documentElement;
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mt-4 font-bold">{news.agent.title}</h1>
      <div className="mt-2 flex items-center text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.4}
          stroke="currentColor"
          className="w-5 h-5 mt-1 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6l4 2m6-5.5a9.5 9.5 0 11-19 0 9.5 9.5 0 0119 0z"
          />
        </svg>
        {new Date(news.date).toLocaleDateString()}

        <MdPreview
          id='hellworld'
          modelValue={news.agent.content}
        />
        <MdCatalog editorId='hellworld' scrollElement={scrollElement} />
      </div>
    </div>
  );
}
