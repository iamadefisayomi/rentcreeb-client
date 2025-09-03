import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import CustomToast from "@/components/CustomToast";
import SocketInitializer from "@/contexts/SocketInitializer";



const poppins = Poppins({ subsets: ["latin"], weight: ['100', '200', "300", '400', '500', '600', '700', '800', '900'] });
 
export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  minimumScale: 1,
}
 
export const metadata: Metadata = {
  title: {
    template: '%s | Rent-Creeb® - Your Trusted Home Rental Partner',
    default: 'Rent-Creeb® - Find Your Perfect Home',
  },
  manifest: "../manifest.json",
  description: 'Rent-Creeb® is your trusted platform for finding and renting homes. Explore a wide range of properties tailored to your needs. Secure, easy, and fast house renting.',
  keywords: 'house renting, home rental, Rent-Creeb, property rental, apartment renting, find homes, secure renting, trusted rental service',
  authors: [{ name: 'Rent-Creeb® Team', url: 'https://www.rentcreeb.com' }],
  openGraph: {
    title: 'Rent-Creeb® - Find Your Perfect Home',
    description: 'Explore a wide range of properties with Rent-Creeb®. Your trusted platform for secure and easy house renting.',
    url: 'https://www.rentcreeb.com',
    type: 'website',
    images: [
      {
        url: 'https://www.rentcreeb.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rent-Creeb® - Find Your Perfect Home',
      },
    ],
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body
        className={cn(poppins.className, "antialiased bg-slate-50")}
      >
            <CustomToast />
            <SocketInitializer />
            {children}
      </body>
    </html>
  );
}