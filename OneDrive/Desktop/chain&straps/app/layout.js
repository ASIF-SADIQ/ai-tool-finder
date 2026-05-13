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
