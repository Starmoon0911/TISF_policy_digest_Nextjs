'use client'
import React, { useState } from 'react';
import { Book, Building, Car } from 'lucide-react';

interface NewsSourceSelectorProps {
  onSelectSource: (sourceId: string) => void; // 新增 onSelectSource prop
}

export default function NewsSourceSelector({ onSelectSource }: NewsSourceSelectorProps) {
  const sources = [
    { id: "executive", name: "行政院", icon: <Building className="h-12 w-12 text-gray-500" /> },
    { id: "education", name: "教育部", icon: <Book className="h-12 w-12 text-green-500" /> },
    { id: "transport", name: "交通部", icon: <Car className="h-12 w-12 text-red-500" /> },
  ];
  const [selectedSource, setSelectedSource] = useState<string>('');

  const handleClick = (sourceId: string) => {
    setSelectedSource(sourceId);
    onSelectSource(sourceId); // 傳遞選擇的 sourceId 回到父組件
  };

  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {sources.map((source) => (
        <div
          key={source.id}
          onClick={() => handleClick(source.id)}
          className={`cursor-pointer flex flex-col items-center p-4 border rounded-lg shadow-md transition-transform transform hover:scale-105 ease-in 
            ${selectedSource === source.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
        >
          <div>{source.icon}</div>
          <span className={`mt-2 text-lg font-medium ${selectedSource === source.id ? 'text-blue-600' : 'text-gray-700'}`}>
            {source.name}
          </span>
        </div>
      ))}
    </div>
  );
}
