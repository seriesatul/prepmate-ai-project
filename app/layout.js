import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "@radix-ui/react-tooltip";
import 'locomotive-scroll/dist/locomotive-scroll.css';

import SmoothScroll from "./components/SmoothScroll"; // Adjust path if needed


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PrepMate AI",
  description: "Online Learning Platform,Cousres Generation and Interview Preparation",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Bungee+Tint&family=Oswald:wght@200..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Romanesco&display=swap" rel="stylesheet" />
          
          <link href="https://fonts.googleapis.com/css2?family=Bungee+Tint&family=Oswald:wght@200..700&family=Playwrite+HU&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Romanesco&display=swap" rel="stylesheet"></link>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
      <SmoothScroll>
            <Provider>
            {children}
          </Provider>
      </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}
