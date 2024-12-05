'use client';
import axios from '@/api/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  agent: {
    title: string;
    content: string;
  };
  date: Date;
  source: string;
}

export default function NewsList({ source }: { source: string }) {
  const router = useRouter();
  const [data, setData] = useState<NewsItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [noMore, setNoMore] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 加載新聞
  const fetchNews = async (currentPage: number) => {
    console.log('starting to fetch data')
    if (loading || noMore) return; // 防止重複請求
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/news/${source}?page=${currentPage}`);
      console.log(`/api/v1/news/${source}?page=${currentPage}`)
      console.log(axios.defaults.baseURL)
      console.log(response.data)
      if (!response.data.success || response.data.data.length === 0) {
        setNoMore(true);
        return;
      }
      setData((prevData) => (currentPage === 1 ? response.data.data : [...prevData, ...response.data.data]));
      console.log(data)
    } catch (error) {
      console.error('Error fetching news:', error);
      setNoMore(true);
    } finally {
      setLoading(false);
    }
  };

  // 當 `source` 變化時，重置資料並初始化
  useEffect(() => {
    setData([]);
    setPage(1);
    setLoading(false);
    setNoMore(false);
    fetchNews(1);
  }, [source]);

  // 當頁數增加時加載更多資料
  useEffect(() => {
    if (page > 1) {
      fetchNews(page);
    }
  }, [page]);

  // Intersection Observer 設定
  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && !noMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [loading, noMore]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card
            key={`${item._id}-${index}`}
            className="flex flex-col border-t border-gray-200 h-full transform transition duration-300 hover:scale-105 cursor-pointer relative"
            onClick={() => router.push(`/news/${item._id}`)}
          >
            <CardHeader>
              <CardTitle className="text-xl">{item.agent?.title || '無標題'}</CardTitle>
            </CardHeader>
            <CardContent className="pb-10">
              <CardDescription>
                {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
              </CardDescription>
              <p className="text-sm text-gray-500 mt-2">{new Date(item.date).toLocaleDateString()}</p>
            </CardContent>
            <CardFooter className="absolute bottom-0 left-0 w-full flex items-center justify-start p-2 bg-white">
              <p>來源:</p>
              <div className="px-1 ml-1 rounded-lg bg-yellow-200 bg-opacity-50 border-yellow-400 border-2">
                <p>{item.source}</p>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div ref={bottomRef} className="text-center my-4">
        {noMore ? <p className="text-gray-500">沒有更多了...</p> : null}
        {loading ? <p>載入中...</p> : null}
      </div>
    </div>
  );
}
