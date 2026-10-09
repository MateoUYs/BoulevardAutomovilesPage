import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CompareBar } from "@/components/cars/CompareBar";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Boulevard Automóviles | Automotora en Uruguay",
    template: "%s | Boulevard Automóviles",
  },
  description: siteConfig.description,
  keywords: [
    "Boulevard Automóviles",
    "Boulevard Automoviles",
    "Boulevard Automoviles",
    "automotora en Uruguay",
    "automotora en Rosario Uruguay",
    "autos en Rosario Uruguay",
    "venta de autos usados Uruguay",
    "permutas de autos Rosario",
    "financiación de autos Uruguay",
  ],
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: "Boulevard Automóviles",
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    images: [
      {
        url: siteConfig.ogImagePath,
        width: 1200,
        height: 630,
        alt: "Logo de Boulevard Automóviles",
      },
    ],
    locale: "es_UY",
    siteName: "Boulevard Automóviles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boulevard Automóviles | Automotora en Uruguay",
    description: siteConfig.description,
    images: [siteConfig.ogImagePath],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  category: "automotive",
};

const baseUrl = siteConfig.siteUrl.replace(/\/$/, "");

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoDealer", "LocalBusiness"],
      "@id": `${baseUrl}/#autodealer`,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: baseUrl,
      logo: `${baseUrl}${siteConfig.logoPath}`,
      image: `${baseUrl}${siteConfig.logoPath}`,
      description: siteConfig.description,
      telephone: [siteConfig.primaryPhoneTel, siteConfig.secondaryPhoneTel],
      sameAs: [siteConfig.instagramUrl, siteConfig.facebookUrl, siteConfig.googleMapsUrl],
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.streetAddress,
        addressLocality: siteConfig.addressLocality,
        addressRegion: siteConfig.addressRegion,
        postalCode: siteConfig.postalCode,
        addressCountry: siteConfig.addressCountry,
      },
      areaServed: siteConfig.areaServed.map((name) => ({ "@type": "Place", name })),
      openingHours: siteConfig.openingHours,
      hasMap: siteConfig.googleMapsUrl,
      priceRange: "USD",
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Venta de autos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Permutas de vehículos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Financiación bancaria para vehículos" } },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: siteConfig.name,
      url: baseUrl,
      publisher: { "@id": `${baseUrl}/#autodealer` },
      inLanguage: "es-UY",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-UY"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareBar />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
