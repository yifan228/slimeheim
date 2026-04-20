import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import LangSwitcher from "@/components/LangSwitcher";
import { Sidebar, MobileMenuButton } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "史萊海姆的遊戲小屋",
  description: "遊戲設計筆記與作品展示",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {/* 桌機左側欄 */}
          <Sidebar />

          {/* 語言切換右上 */}
          <div style={{ position: "fixed", top: "12px", right: "16px", zIndex: 100 }}>
            <LangSwitcher />
          </div>

          {/* 手機漢堡選單 */}
          <MobileMenuButton />

          {/* 主內容，桌機向右推 48px */}
          <div className="main-content" style={{ marginLeft: "48px" }}>
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
