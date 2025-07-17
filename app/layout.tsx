import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./context/auth-context";
import { EmailLinkHandler } from "@/components/email-link-handler";
import { WhatsappProvider } from "./context/whatsapp";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SejookNamastey",
  description: "SejookNamastey: Dashboard for Sejuk Sejuk Services Sdn Bhd, made by @metalheadcode",
  metadataBase: new URL("https://utopia-assessment.vercel.app"),
  openGraph: {
    title: "SejookNamastey",
    description: "SejookNamastey: Dashboard for Sejuk Sejuk Services Sdn Bhd, made by @metalheadcode",
    url: "https://utopia-assessment.vercel.app",
    type: "website",
    images: [
      {
        url: "/images/og.jpeg",
        width: 1200,
        height: 720,
        type: "image/jpeg",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <WhatsappProvider>
            <EmailLinkHandler />
            {children}
          </WhatsappProvider>
        </AuthProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
