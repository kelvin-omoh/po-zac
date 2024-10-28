import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POSACRO",
  description: "POSACRO - Positive Acronym",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-georama`}
      >
        {children}
      </body>
    </html>
  );
}
