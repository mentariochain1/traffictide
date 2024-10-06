import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TelegramWebAppSetup } from "@/components/TelegramWebAppSetup";
import { ErrorHandler } from "@/components/ErrorHandler";
import { TelegramHeaderColor } from "@/components/TelegramHeaderColor";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import '@/utils/telegramGameProxyPolyfill';
import { ClientProviders } from '@/components/ClientColorProvider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const ImagePreloader = dynamic(() => import('@/components/ImagePreloader'), { ssr: false });

export const metadata: Metadata = {
  title: "TrafficTide",
  description: "TrafficTide mini app",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1, minimum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no, maximum-scale=1, minimum-scale=1" />
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <Script id="telegram-web-app-setup">
          {`
            window.Telegram.WebApp.ready();
          `}
        </Script>
        <Script id="prevent-zoom">
          {`
            document.addEventListener('touchmove', function (event) {
              if (event.scale !== 1) { event.preventDefault(); }
            }, { passive: false });
            document.addEventListener('gesturestart', function (event) {
              event.preventDefault();
            }, { passive: false });
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col bg-black text-white no-zoom`}
      >
        <ClientProviders>
          <ErrorHandler />
          <TelegramWebAppSetup />
          <TelegramHeaderColor />
          <ImagePreloader />
          <div className="flex-1 overflow-hidden">{children}</div>
        </ClientProviders>
      </body>
    </html>
  );
}
