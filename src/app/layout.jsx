import "./globals.css";

export const metadata = {
  title: "POSACRO",
  description: "POSACRO - Positive Acronym",
};

export default function RootLayout({
  children,
}) {
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
