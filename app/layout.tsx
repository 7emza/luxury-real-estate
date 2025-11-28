import type { Metadata } from "next";
import { Playfair_Display, Inter, Tajawal, Aref_Ruqaa } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ContentProvider } from "@/contexts/ContentContext";

// Latin fonts
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Arabic fonts
const tajawal = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-arabic-display",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "LuxuryEstates - Premium Real Estate in Dubai",
  description: "Discover luxury properties in Dubai. Browse premium villas, apartments, and commercial spaces.",
};

// Script to prevent flash of wrong theme and RTL
const initScript = `
  (function() {
    try {
      // Theme
      var theme = localStorage.getItem('lre-theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // RTL - Check saved language
      var lang = localStorage.getItem('lre-language');
      var rtlLanguages = ['ar', 'darija'];
      if (lang && rtlLanguages.includes(lang)) {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = lang;
      } else if (lang) {
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = lang;
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${tajawal.variable} ${arefRuqaa.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-gray-100`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} storageKey="lre-theme" disableTransitionOnChange={false}>
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
