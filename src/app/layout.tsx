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

export const metadata = {
  title: 'FillUp - Form Builder',
  description: 'Create and manage forms easily with FillUp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="font-sans">
          <NextUIProvider>
            {children}
            <Toaster position="top-center" />
          </NextUIProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
