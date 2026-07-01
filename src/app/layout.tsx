import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Marlow Quinn",
  description: "Emotional MM Romance with bite, heat, and heart.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
