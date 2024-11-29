'use client';
import axios from '@/api/axios';
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
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set()); // 追蹤已顯示的卡片
  const [noMore, SetnoMore] = useState<boolean>(false);
  // 加載新聞數據
  const fetchNews = async (currentPage: number) => {
    if (noMore) return; // 如果已經沒有更多數據，直接返回
  
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/news/executive?page=${currentPage}`);
  
      // 檢查響應是否成功
      const responseData = response.data;
      if (!responseData.success) {
        SetnoMore(true); // 如果 success 為 false，設置 noMore 並停止加載
        return;
      }
  
      // 如果有數據，將其添加到現有數據中
      if (responseData?.data) {
        setData((prevData) => [...prevData, ...responseData.data]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false); // 無論成功或失敗，重置加載狀態
    }
  };
  // 初始加載
  useEffect(() => {
    fetchNews(page);
  }, [page]);

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

  // Intersection Observer 設定（每個卡片動畫）
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const cardElements = document.querySelectorAll('.card');

    cardElements.forEach((card, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisibleCards((prev) => new Set(prev).add(index)); // 加入可見卡片索引
              observer.disconnect(); // 停止觀察該卡片，避免重複觸發
            }
          });
        },
        { threshold: 0.5 } // 當一半卡片進入視口時觸發
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    }; // 清除所有觀察器
  }, [data]);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
<div>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.length > 0 &&
      data.map((item, index) => (
        <Card
          key={`${item._id}-${index}`}
          className={`card flex flex-col border-t border-gray-200 h-full ${
            visibleCards.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } transition-all duration-100 ease-out`}
          onClick={() => {
            router.push(`/news/${item._id}`);
          }}
        >
          <CardHeader>
            <CardTitle className="text-xl">{item.agent?.title || '無標題'}</CardTitle>
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
    {noMore ? (
      <p className="text-gray-500">沒有更多了...</p>
    ) : loading ? (
      <p className="text-gray-500">載入中...</p>
    ) : (
      <p className="text-gray-500">向下滑動以加載更多</p>
    )}
  </div>
</div>

  );
}
