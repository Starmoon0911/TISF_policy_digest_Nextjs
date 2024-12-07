'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input'; // 假設這是ShadCN的Input組件
import axios from '@/api/axios'
// 表情選項數據，包含表情符號與對應文字
const emojiOptions = [
  { emoji: '😊', label: '滿意' },
  { emoji: '😐', label: '普通' },
  { emoji: '😟', label: '不滿意' },
];
interface FeedbackComponentProps {
  newsID: string;
}
export default function FeedbackComponent({ newsID }: FeedbackComponentProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<{ emoji: string; label: string } | null>(null); // 當前選擇的表情
  const [feedback, setFeedback] = useState<string>(''); // 使用者的意見回復
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // 提交後的狀態
  const [loading, setLoading] = useState<boolean>(false); // 提交請求時的加載狀態
  const [error, setError] = useState<string | null>(null); // 用於存儲錯誤訊息

  // 表情點擊事件
  const handleEmojiClick = (emoji: { emoji: string; label: string }) => {
    setSelectedEmoji((prev) => (prev?.emoji === emoji.emoji ? null : emoji));
  };

  // 意見輸入框變化事件
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.target.value);
  };

  // 提交表單事件
  const handleSubmit = async () => {
    if (!selectedEmoji || feedback.trim() === '') {
      alert('請選擇表情並輸入您的意見！');
      return;
    }

    setLoading(true);
    setError(null); // 清空上次的錯誤
    try {
      const response = await axios.post('/api/v1/feedback', {
        emoji: selectedEmoji,
        feedback,
        newsID:newsID,
      });

      if (response.data.success) {
        setIsSubmitted(true);
      } else {
        setError('提交失敗，請稍後再試');
      }
    } catch (err) {
      console.error('提交意見錯誤:', err);
      setError('提交失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">意見回復</h2>

      {/* 表情選擇 */}
      <div className="flex justify-center gap-4 mb-4">
        {emojiOptions.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className={`flex flex-col items-center text-3xl transition-transform duration-200 ${selectedEmoji?.emoji === emoji.emoji
                ? 'text-blue-500 transform scale-125'
                : 'text-gray-500'
              }`}
          >
            <span>{emoji.emoji}</span>
            <span className="text-sm mt-1">{emoji.label}</span>
          </button>
        ))}
      </div>

      {/* 輸入框 */}
      <div className="mb-4">
        <Input
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="請輸入您的意見..."
          className="w-full border-gray-300 p-2 rounded-md"
          disabled={loading || isSubmitted}
        />
      </div>

      {/* 提交按鈕 */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
          disabled={isSubmitted || loading}
        >
          {loading ? '提交中...' : isSubmitted ? '已提交' : '提交意見'}
        </button>
      </div>

      {/* 錯誤訊息 */}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
}
