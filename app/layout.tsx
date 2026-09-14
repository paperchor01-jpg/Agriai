import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AgriAI — Smart Crop Advisory System (SIH25010)",
  description:
    "AI-Powered Farming. Smarter Decisions. Better Yields. Get personalized crop health insights, disease detection, irrigation recommendations and farm intelligence.",
  icons: {
    icon: "/favicon.ico",
  },
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('agriai_theme');
    var isDark = false;
    if (stored === 'dark') {
      isDark = true;
    } else if (stored === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = false; // Default for new users is light mode
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          {/* Ambient subtle background light effects for glass depth */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl" />
            <div className="absolute top-1/3 -left-40 w-96 h-96 bg-sky-400/10 dark:bg-teal-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-amber-400/10 dark:bg-emerald-900/10 rounded-full blur-3xl" />
          </div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
