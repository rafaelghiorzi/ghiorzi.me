import { LanguageProvider } from "@/context/LanguageContext";
import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
    variable: "--font-serif",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Rafael Ghiorzi | SWE",
        template: "%s | Rafael Ghiorzi",
    },
    description: "Personal Portfolio Website",
    keywords: [
        "portfolio",
        "desenvolvedor",
        "nextjs",
        "react",
        "frontend",
        "web developer",
    ],
    authors: [{ name: "Rafael Ghiorzi" }],
    creator: "Rafael Ghiorzi",
    metadataBase: new URL("https://rafaelghiorzi.org"),
    openGraph: {
        title: "Rafael Ghiorzi — Portfolio",
        description: "Personal Portfolio Website.",
        url: "https://rafaelghiorzi.org",
        siteName: "Rafael Ghiorzi Portfolio",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Preview do portfolio",
            },
        ],
        locale: "pt_BR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Rafael Ghiorzi — Portfolio",
        description: "Personal Portfolio Website.",
        images: ["/og.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <LanguageProvider>
            <html lang="en" className={`${serif.variable} antialiased`}>
                <body>{children}</body>
            </html>
        </LanguageProvider>
    );
}
