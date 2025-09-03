import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coming Soon | RentCreeb",
  description:
    "Exciting features and updates are on the way! Stay tuned as RentCreeb prepares to launch new tools to make property search and management easier than ever.",
  openGraph: {
    title: "Coming Soon | RentCreeb",
    description:
      "We’re working hard behind the scenes to bring you the best property listing experience. Check back soon!",
    url: "https://rentcreeb.com/coming-soon",
    siteName: "RentCreeb",
    images: [
      {
        url: "https://rentcreeb.com/images/coming-soon-banner.png",
        width: 1200,
        height: 630,
        alt: "Coming Soon - RentCreeb",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coming Soon | RentCreeb",
    description:
      "New features are on the way at RentCreeb. Stay tuned for updates!",
    images: ["https://rentcreeb.com/images/coming-soon-banner.png"],
  },
  robots: {
    index: false,
    follow: true,
  },
};


export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}