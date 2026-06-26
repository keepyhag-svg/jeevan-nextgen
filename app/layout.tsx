import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { ReactLenis } from "lenis/react";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: 'swap' });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ['400', '700', '800'], display: 'swap' });

export default function RootLayout({
  children,
  modal, // <-- WE ADDED THIS
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode; // <-- AND THIS
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`}>
      <body className="antialiased bg-white text-black font-sans selection:bg-black selection:text-white">
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
          {children}
          {modal} {/* <-- AND THIS */}
        </ReactLenis>
      </body>
    </html>
  );
}