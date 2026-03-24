import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2015 Alabama Football — Where Are They Now",
  description: "Track what every player from the 2015 Alabama Crimson Tide championship team is doing today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
