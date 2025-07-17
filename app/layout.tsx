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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta property="og:image" content="/images/og.jpeg" />
      <meta property="og:title" content="SejookNamastey" />
      <meta property="og:description" content="SejookNamastey: Dashboard for Sejuk Sejuk Services Sdn Bhd, made by @metalheadcode" />
      <meta property="og:url" content="https://utopia-assessment.vercel.app" />
      <meta property="og:type" content="website" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="720" />
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
