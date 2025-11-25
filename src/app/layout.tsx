import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProviders } from "./providers";
import { loadCmsDataServer } from "@/lib/cms/server-load";

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Emil Ciubotaru - Artist & Pictor",
  description:
    "Galeria oficială a artistului vizual Emil Ciubotaru: pictură figurativă, abstracții cu texturi bogate și povești în culoare.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await loadCmsDataServer();

  return (
    <html lang="ro">
      <body className={`${cormorant.variable} ${inter.variable} antialiased`}>
        <AppProviders initialData={initialData}>
          <Toaster />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
