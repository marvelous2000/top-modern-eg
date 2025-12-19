import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "@/app/globals.css"; // Global CSS for all layouts

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Temporarily comment out Lora due to network issues
// const lora = Lora({
//   subsets: ["latin"],
//   variable: "--font-serif",
//   display: "swap",
// });

export const metadata: Metadata = {
  title: "Top Modern",
  description: "Luxury marble and granite solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex flex-col font-sans antialiased h-full">
        <Suspense>{children}</Suspense>
      </body>
    </html>
  );
}
