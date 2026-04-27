import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Debug Platform",
  description: "Debug your code with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#0f0f0f] text-white`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}