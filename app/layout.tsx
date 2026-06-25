import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jeevan NextGen",
  description: "The NextGen Assamese Magazine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We safely hardcode your public key here so it never gets stuck loading
  return (
    <ClerkProvider publishableKey="pk_test_aW1tb3J0YWwtYWRrZXItNjYuY2xlcmsuYWNjb3VudHMuZGV2JA">
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}