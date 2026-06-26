import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Jeevan NextGen",
  description: "The NextGen Assamese Magazine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // We add 'light' by default, but it can be toggled to 'dark'
    <html lang="en" className="light">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased transition-colors duration-500`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}