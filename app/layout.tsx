import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "小P的每日一书",
  description: "小P每天一本好书的深度消化报告与播客",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <header className="site-header">
          <a href="/" className="site-logo">📚 小P的每日一书</a>
          <ThemeToggle />
        </header>
        <main className="site-main">{children}</main>
        <footer className="site-footer">
          <span>小P的每日一书 · 深度阅读消化</span>
        </footer>
      </body>
    </html>
  );
}
