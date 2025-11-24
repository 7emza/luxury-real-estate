import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContentProvider } from "@/contexts/ContentContext";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxuryEstates - Premium Real Estate in Dubai",
  description: "Discover luxury properties in Dubai. Browse premium villas, apartments, and commercial spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <ContentProvider>
            <div className="min-h-screen bg-white dark:bg-black">
              <Navbar />
              <main className="pt-20">
                {children}
              </main>
              <Footer />
            </div>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
