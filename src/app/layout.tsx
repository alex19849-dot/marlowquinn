import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.marlowquinn.com"),

  title: {
    default: "Marlow Quinn | Emotional MM Romance Author",
    template: "%s | Marlow Quinn",
  },

  description:
    "Discover emotional MM romance by Marlow Quinn. Sports romance, paranormal romance, romantic suspense, found family, forbidden attraction, high heat, and unforgettable happily-ever-afters.",

  keywords: [
    "Marlow Quinn",
    "MM romance",
    "Gay romance",
    "LGBT romance",
    "Sports romance",
    "Paranormal romance",
    "Motorcycle club romance",
    "College romance",
    "Vampire romance",
    "Werewolf romance",
    "Kindle Unlimited",
    "Gay love stories",
    "Male male romance",
    "Romantic suspense",
  ],

  authors: [{ name: "Marlow Quinn" }],
  creator: "Marlow Quinn",
  publisher: "Marlow Quinn",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Marlow Quinn | Emotional MM Romance",
    description: "Dark, emotional MM romance with bite, heat, and heart.",
    url: "https://www.marlowquinn.com",
    siteName: "Marlow Quinn",
    locale: "en_GB",
    type: "website",
    images: [
  {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Marlow Quinn author website",
  },
],
  },

  twitter: {
  card: "summary_large_image",
  title: "Marlow Quinn | Emotional MM Romance",
  description: "Dark, emotional MM romance with bite, heat, and heart.",
  images: ["/og-image.jpg"],
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Marlow Quinn",
    url: "https://www.marlowquinn.com",
    image: "https://www.marlowquinn.com/marlow-logo.png",
    sameAs: [
      "https://www.facebook.com/MarlowQuinn",
      "https://www.bookbub.com/profile/marlow-quinn",
      "https://www.tiktok.com/@marlow.quinn",
    ],
    jobTitle: "Author",
    description:
      "Author of emotional MM romance featuring sports romance, paranormal romance, romantic suspense, found family, forbidden attraction, and high-heat happily-ever-afters.",
  };

  return (
    <html lang="en">
      <body className="bg-[#050505] text-white antialiased">
        <Script
  src="https://www.googletagmanager.com/gtag/js?id=G-BXBMNNQ1TH"
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-BXBMNNQ1TH');
  `}
</Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(authorSchema),
          }}
        />

        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
