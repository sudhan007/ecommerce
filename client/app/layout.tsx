import "@/styles/globals.css";
import clsx from "clsx";
import { Metadata } from "next";
import Shoppingcart from "./components/Home/Cart/Shoppingcart";
import { Providers } from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Starex ",
  description: "Starex - I dont know what that fudge i am coding!",
  icons: "/favicon.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* <Script
          type="text/javascript"
          src="https://otpless.com/auth.js"
          cid="9Q1QR2DXJYFB1Y3T0QQ704JXBGU82DMG"
        /> */}

        <Script
          src='https://otpless.com/v2/auth.js'
          data-appid='TZ76JYNHHTEDGNMT4VIC'
          id='otpless-sdk'
          strategy='afterInteractive'
        />
        <Script
          src='https://unpkg.com/esri-leaflet'
          strategy='afterInteractive'
        />
        <Script
          src='https://unpkg.com/esri-leaflet-geocoder'
          strategy='afterInteractive'
        />

        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          crossOrigin=''
        />

        <link
          rel='stylesheet'
          href='https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
        />
      </head>
      <body
        className={clsx("min-h-screen bg-background font-sans antialiased")}>
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <main>
            {children}
            <Shoppingcart />
          </main>
        </Providers>
      </body>
    </html>
  );
}
