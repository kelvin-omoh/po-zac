import "./globals.css";

export const metadata = {
  title: "PO-ZAC",
  description: "PO-ZAC Game  also known as mind shield and bullying-proof game has been developed to train the mind to respond positively to any form of verbal bullying. It is intended to ultimately develop children and adolescents to be emotionally resilient and mentally strong and prepared against verbal bullying. This game is a form of bibliotherapy intervention to mitigate the negative effect of verbal bullying—specifically, the use of insulting and abusive words. PO-ZAC serves as mind shield to resist verbal bullying and proof against feelings that could cause trauma and alienation socially and emotionally.",
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
