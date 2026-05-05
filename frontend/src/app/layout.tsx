import type { Metadata } from "next";
import { Inter, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "Centrus ERP",
  description: "Retail, Manufacturing, and FMCG ERP for Saudi Arabia",
  icons: {
    icon: "/images/Centrus_Icon.png",
    shortcut: "/images/Centrus_Icon.png",
    apple: "/images/Centrus_Icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${notoKufiArabic.variable} antialiased`}
    >
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
