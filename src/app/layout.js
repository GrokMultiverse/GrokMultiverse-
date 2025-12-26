import "./globals.css";

export const metadata = {
  title: "GrokMultiverse",
  description: "Solana NFT Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
