import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "正文導讀",
  description: "這是一個科展的作品w",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header */}
        <header className="bg-gray-800 text-white py-4 shadow-md">
          <div className="container mx-auto flex items-center">
          
            {/* 大標題 */}
            <Link href="/" passHref>
              <h1 className="text-2xl font-bold cursor-pointer ml-4 hover:text-gray-400">
                政文導讀
              </h1>
            </Link>
          </div>
        </header>
        {/* Main Content */}
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
