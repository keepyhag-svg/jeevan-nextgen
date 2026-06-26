import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import { ReactLenis } from "lenis/react";
import { Providers } from "./providers"; // <-- Import the provider
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: 'swap' });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ['400', '700', '800'], display: 'swap' });

export const metadata: Metadata = {
  title: "W.CREATORS | JEEVAN.",
  description: "A premium, high-contrast digital platform built for premium creative exposure.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    {/* Add suppressHydrationWarning here */}
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${syne.variable}`}>
      {/* We add the dark mode background and text colors to the body here */}
      <body className="antialiased bg-white text-black dark:bg-[#0B0B0C] dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
        <Providers>
          <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            {children}
            {modal}
          </ReactLenis>
        </Providers>
      </body>
    </html>
  );
}