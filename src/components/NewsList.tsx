'use client';
import axios from '@/api/axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

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
  source: string;
}

interface NewsListProps {
  source: string;
}

export default function NewsList({ source }: NewsListProps) {
  const router = useRouter();
  const [data, setData] = useState<NewsItem[]>([]); // 資料狀態
  const [page, setPage] = useState<number>(1); // 分頁狀態
  const [loading, setLoading] = useState<boolean>(false); // 加載狀態
  const [noMore, setNoMore] = useState<boolean>(false); // 無更多資料標記
  const bottomRef = useRef<HTMLDivElement>(null); // 分頁觀察器

  // 重置資料
  const resetData = useCallback(() => {
    setData([]);
    setPage(1);
    setLoading(false);
    setNoMore(false);
  }, []);

  // 加載新聞數據
  const fetchNews = useCallback(async (currentPage: number) => {
    if (noMore || loading) return; // Prevent duplicate requests or loading when there's no more data
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/news/${source}?page=${currentPage}`);

      // Check if the response status is not in the 200-299 range
      if (response.status < 200 || response.status >= 300) {
        setNoMore(true);
        return;
      }

      // Check if the response is successful
      const responseData = response.data;
      if (!responseData.success) {
        setNoMore(true);
        return;
      }

      // Update data
      if (responseData.data) {
        setData((prevData) => (currentPage === 1 ? responseData.data : [...prevData, ...responseData.data]));
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setNoMore(true); // Set noMore to true in case of any error
    } finally {
      setLoading(false);
    }
  }, [loading, noMore, source]);

  // 當 `source` 變更時，重置並重新請求資料
  useEffect(() => {
    resetData();
    fetchNews(1); // 初始化請求
  }, [source, fetchNews, resetData]);

  // 當頁面改變時，請求新資料
  useEffect(() => {
    if (page > 1) {
      fetchNews(page);
    }
  }, [page, fetchNews]);

  // Intersection Observer 設定（分頁加載）
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
            <CardContent className="pb-10"> {/* 增加下邊距，避免內容被 footer 覆蓋 */}
              <CardDescription>
                {item.description.length > 40 ? `${item.description.slice(0, 40)}...` : item.description}
              </CardDescription>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="absolute bottom-0 left-0 w-full flex items-center justify-start p-2 bg-white">
              <p>來源:</p>
              <div className="px-1 ml-1 rounded-lg bg-yellow-200 bg-opacity-50 border-yellow-400 border-2">
                <p>
                  {item.source}
                </p>
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
