import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";
import "./globals.css";
import "./css/main.css";
import ThirdwebProviderComponent from "./providers/ThirdwebProviderComponent";
import '../fontawesome'; // Corrected path


const londrina = Londrina_Solid({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: "GM",
  description: "GM - v1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={londrina.className + " page1 gradient-background"}>
        <ThirdwebProviderComponent>
          {children}
        </ThirdwebProviderComponent>
      </body>
    </html>
  );
}

