import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "遊戲設計筆記",
  description: "王奕凡的遊戲設計讀書筆記與作品展示",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
