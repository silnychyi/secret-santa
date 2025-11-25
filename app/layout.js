import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
  title: "Secret Santa Generator | Free Online Gift Exchange Organizer",
  description:
    "Organize your Secret Santa gift exchange effortlessly. Set budget limits, add participants, and generate private assignment links. Free, easy, and fun!",
  keywords: [
    "secret santa",
    "gift exchange",
    "secret santa generator",
    "christmas gift exchange",
    "holiday gift exchange",
    "secret santa organizer",
    "gift exchange organizer",
    "free secret santa",
    "online secret santa",
  ],
  authors: [{ name: "Secret Santa Generator" }],
  creator: "Secret Santa Generator",
  publisher: "Secret Santa Generator",
  openGraph: {
    title: "Secret Santa Generator | Free Online Gift Exchange Organizer",
    description:
      "Organize your Secret Santa gift exchange effortlessly. Set budget limits, add participants, and generate private assignment links. Free, easy, and fun!",
    type: "website",
    locale: "en_US",
    siteName: "Secret Santa Generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Secret Santa Generator | Free Online Gift Exchange Organizer",
    description:
      "Organize your Secret Santa gift exchange effortlessly. Set budget limits, add participants, and generate private assignment links.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Secret Santa Generator",
    description:
      "Free online tool to organize Secret Santa gift exchanges. Set budget limits, add participants, and generate private assignment links.",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Set gift budget limits",
      "Add unlimited participants",
      "Generate private assignment links",
      "Custom house rules",
      "No registration required",
    ],
  };

  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
