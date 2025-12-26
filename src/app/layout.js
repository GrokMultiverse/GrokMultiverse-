import "./globals.css";
import WalletContextProvider from "../components/WalletContextProvider";

export const metadata = {
  title: "GrokMultiverse Dashboard",
  description: "Secure Solana NFT Ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN for backup if local CSS fails */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-black text-yellow-500">
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
