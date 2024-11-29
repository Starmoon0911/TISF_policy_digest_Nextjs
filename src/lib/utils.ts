import axios from 'axios';
import { EYnews } from '@/types'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const getEYNewscontent = async (id: string): Promise<EYnews | null> => {
  try {
    const response = await axios.get(`http://localhost:9000/api/v1/news/executive?id=${id}`);
    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching news content:', error);
    return null;
  }
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
