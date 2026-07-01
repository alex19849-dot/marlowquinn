import type { Metadata } from "next";
import "./globals.css";
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
      <body>{children}</body>
    </html>
  );
}
