import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TitanXLogistics",
  description: "TitanXLogistics - Designed to Move the World. Experience next-generation tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      {/* 
        We force dark mode by adding 'dark' here and setting background to #000 
        in CSS for that signature Apple midnight look. Adjust if light theme desired. 
      */}
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-[#0071E3]/30 selection:text-white antialiased`}>

        {/* Main Content Area */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
