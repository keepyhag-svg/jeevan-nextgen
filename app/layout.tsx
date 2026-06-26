import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

// The clean, modern body font
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-jakarta" 
});

// The aggressive, geometric header font
const syne = Syne({ 
  subsets: ["latin"], 
  variable: "--font-syne" 
});

export const metadata: Metadata = {
  title: "JEEVAN | The Next-Gen Archive",
  description: "Culture, Redefined.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Injecting both font variables into the body */}
      <body className={`${jakarta.variable} ${syne.variable} font-sans antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}