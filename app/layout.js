import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TitanXLogistics",
  description: "TitanXLogistics - Designed to Move the World. Experience next-generation tracking.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen text-foreground antialiased`}>

        {/* Main Content Area */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
