'use client'
import React, { useEffect, useState } from "react"
import { format } from "date-fns"

interface NewsData {
    _id: string
    title: string
    date: Date
    desc: string
}

interface NewsListProps {
    data: NewsData[]
}

export default function NewsList({ data }: NewsListProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    // 每次 data 變更時觸發動畫
    useEffect(() => {
        setIsAnimating(false);
        const timer = setTimeout(() => setIsAnimating(true), 100);
        return () => clearTimeout(timer);
    }, [data]);

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">最新新聞</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.map((news, index) => (
                    <div
                        key={news._id}
                        className={`p-4 border rounded-lg shadow-lg bg-white transform transition-all duration-500 ease-in-out
                          ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        `}
                        style={{ transitionDelay: `${index * 100}ms` }} // 瀑布式延遲
                    >
                        <h3 className="border-b-2 border-gray-200 text-2xl font-semibold text-gray-800 mb-2">{news.title}</h3>
                        <p className="text-gray-600 font-semibold text-sm mb-2">{news.desc}</p>
                        <p className="text-gray-500 text-sm">{format(new Date(news.date), "yyyy/MM/dd")}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
