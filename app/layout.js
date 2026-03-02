import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tropicade",
  description: "Tropicade - Designed to Move the World. Experience next-generation tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      {/* 
        We force dark mode by adding 'dark' here and setting background to #000 
        in CSS for that signature Apple midnight look. Adjust if light theme desired. 
      */}
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-[#0071E3]/30 selection:text-white antialiased`}>
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full z-50 glass border-b-0 backdrop-blur-2xl bg-white/50 dark:bg-black/50 transition-all duration-300">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2 font-semibold tracking-tighter text-lg">
                <div className="h-6 w-6 rounded-md bg-[#0071E3] flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full 0" />
                </div>
                Tropicade
              </div>
              <div className="flex gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                <a href="/" className="hover:text-foreground transition-colors">Track</a>
                <a href="/admin" className="hover:text-foreground transition-colors">Admin</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
