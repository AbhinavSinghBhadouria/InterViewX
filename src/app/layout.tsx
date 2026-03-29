import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/src/components/ui/sonner";
import PageTransition from "@/src/components/PageTransition";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "InterviewX",
  description: "An Ai powered platform with mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monaSans.className} antialiased pattern min-h-screen`}
      > 

        <PageTransition>{children}</PageTransition>
        <Toaster closeButton richColors position="top-right" />
       
      </body>
       
    </html>
  );
}
