import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Delivery Person Dashboard",
  description: "Starex Delivery Person app",
  icons: "/fav.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <main> {children}</main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
