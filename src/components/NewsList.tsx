'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

// 定義 NewsItem 型別
interface NewsItem {
  _id: string;
  title: string;
  description: string;
  agent: {
    title: string;
    content: string;
  };
  date: Date;
}

export default function NewsList() {
  const router = useRouter();
  const [data, setData] = useState<NewsItem[]>([]); // 指定型別為 NewsItem[]
  const [page, setPage] = useState<number>(1); // 分頁狀態
  const [loading, setLoading] = useState<boolean>(false); // 加載狀態
  const bottomRef = useRef<HTMLDivElement>(null); // 觀察器參考

  // 加載新聞數據
  const fetchNews = async (currentPage: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/api/v1/news/executive?page=${currentPage}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData?.data) {
        setData((prevData) => [...prevData, ...responseData.data]); // 合併新數據
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加載
  useEffect(() => {
    fetchNews(page);
  }, [page]);

  // Intersection Observer 設定
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prevPage) => prevPage + 1); // 滑到底時分頁 +1
        }
      },
      { threshold: 1.0 } // 完全進入視口時觸發
    );

    observer.observe(bottomRef.current);

    return () => observer.disconnect(); // 清除觀察器
  }, [loading]);

  if (data.length === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600">我們好像錯過了最新時事...</p>
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            className={`flex flex-col border-t border-gray-200 h-full opacity-0 animate-slide-in delay-${index * 100}`}
            onClick={() => {
              router.push(`/news/${item._id}`);
            }}
          >
            <CardHeader>
              <CardTitle className="text-xl">{item.agent.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="flex-1">
                {truncateText(item.description, 40)}
              </CardDescription>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 加載更多標示 */}
      <div ref={bottomRef} className="text-center my-4">
        {loading ? (
          <p className="text-gray-500">載入中...</p>
        ) : (
          <p className="text-gray-500">向下滑動以加載更多</p>
        )}
      </div>
    </div>
  );
}
