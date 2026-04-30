import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Indian Election Journey",
  description: "Learn about the Indian election process through an interactive timeline and AI assistant.",
};

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0F172A] text-slate-50 selection:bg-orange-500/30 selection:text-orange-200`}>
        {/* Decorative background elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[150px] opacity-10"></div>
        </div>
        
        {children}
        <GoogleAnalytics gaId="G-PLACEHOLDER" />
      </body>

    </html>
  );
}
