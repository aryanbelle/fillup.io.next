import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import localFont from 'next/font/local';

// Initialize the Inter var font (variable font)
const inter = localFont({
  src: '../fonts/Inter-var.woff2',
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>FillUp</title>
      </head>
      <NextUIProvider>
        <ClerkProvider>
          <body className="font-sans">
            {children}
            <Toaster position="top-center" />
          </body>
        </ClerkProvider>
      </NextUIProvider>
    </html>
  );
}
