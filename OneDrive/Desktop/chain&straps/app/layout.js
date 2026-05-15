import { Inter, Montserrat, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartDrawer from "@/components/CartDrawer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Chain & Straps | Luxury Redefined",
  description: "Curated pieces from the world's most iconic maisons.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable}`}>
      <head>
        {/* Pinterest Tag */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(e){if(!window.pintrk){window.pintrk = function () {
              window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
                n=window.pintrk;n.queue=[],n.version="3.0";var
                t=document.createElement("script");t.async=!0,t.src=e;var
                r=document.getElementsByTagName("script")[0];
                r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
              pintrk('load', 'YOUR_PINTEREST_TAG_ID', {em: '<user_email_address>'});
              pintrk('page');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }} alt=""
            src="https://ct.pinterest.com/v3/?event=init&tid=YOUR_PINTEREST_TAG_ID&pd[em]=<hashed_email_address>&noscript=1" />
        </noscript>
      </head>
      <body className="bg-bg-primary text-text-primary antialiased selection:bg-gold selection:text-bg-primary">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
