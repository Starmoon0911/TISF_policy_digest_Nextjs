export interface EYnews {
  _id: string;
  title: string;
  date: Date;
  description: string;
  link: string;
  images: {
    url: string;
    desc: string;
    _id: string;
  }[];
  __v: number;
  content: string;
  agent: {
    content: string;
    title: string;
  };
}
