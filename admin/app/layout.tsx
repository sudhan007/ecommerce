import "../styles/globals.css";
import { Metadata } from "next";
import { Providers } from "./providers";
import clsx from "clsx";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "StarX Admin Dashboard",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
