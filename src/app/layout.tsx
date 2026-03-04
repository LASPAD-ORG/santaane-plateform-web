import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Global Africa Journal",
  description: "Plateforme de publication scientifique du LASPAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={notoSans.variable} suppressHydrationWarning>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}