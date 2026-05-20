import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import HeroContent from "@/components/HeroContent";
import { API_BASE as API, API_BASE } from "@/lib/config";

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

export default async function Home() {
  // Fetch New Arrivals (latest 8 products) from MongoDB backend
  let newArrivals = [];
  try {
    const res = await fetch(`${API_BASE}/products?limit=8`, { next: { revalidate: 60 } });
    const data = await res.json();
    newArrivals = data.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  // Marquee Brands
  const marqueeBrands = [
    "LV", "GUCCI", "PRADA", "CHANEL", "DIOR", "BALENCIAGA"
  ];

  return (
    <div>
      {/* SECTION 2 - HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient & particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/10 via-bg-primary to-bg-primary z-0" />
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }} 
            />
          ))}
        </div>

        <HeroContent />
      </section>

      {/* SECTION 3 - BRAND MARQUEE */}
      <div className="bg-bg-secondary border-y border-border-color py-6 overflow-hidden relative flex">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeBrands, ...marqueeBrands, ...marqueeBrands].map((brand, i) => (
            <div key={i} className="flex items-center mx-8">
              <span className="text-gold text-lg tracking-[0.4em] uppercase">{brand}</span>
              <span className="text-gold mx-8 text-[8px]">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4 - CATEGORIES BENTO GRID */}
      <section className="py-24 container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-gold text-2xl tracking-[0.3em] uppercase">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:h-[600px]">
          {/* Large Card */}
          <Link href="/category/bags" className="group relative overflow-hidden md:col-span-2 md:row-span-2 bg-bg-secondary aspect-square md:aspect-auto">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/10 transition-colors duration-500 z-10" />
            {/* Note: In a real app, you'd use a real image for categories here */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=2000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 border border-transparent group-hover:border-gold transition-colors duration-500 z-20 m-4" />
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="font-serif text-white text-4xl mb-2">SIGNATURE BAGS</h3>
              <p className="text-gold text-xs tracking-widest uppercase">Explore Collection</p>
            </div>
          </Link>

          {/* Medium Cards */}
          <Link href="/category/shoes" className="group relative overflow-hidden bg-bg-secondary aspect-square md:aspect-auto">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/10 transition-colors duration-500 z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 border border-transparent group-hover:border-gold transition-colors duration-500 z-20 m-4" />
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="font-serif text-white text-3xl mb-2">PREMIUM SHOES</h3>
              <p className="text-gold text-xs tracking-widest uppercase">Discover</p>
            </div>
          </Link>

          <Link href="/category/watches" className="group relative overflow-hidden bg-bg-secondary aspect-square md:aspect-auto">
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/10 transition-colors duration-500 z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 border border-transparent group-hover:border-gold transition-colors duration-500 z-20 m-4" />
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="font-serif text-white text-3xl mb-2">ICONIC WATCHES</h3>
              <p className="text-gold text-xs tracking-widest uppercase">Discover</p>
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 5 - FEATURED PRODUCTS (Paginated) */}
      <section className="py-12 bg-bg-secondary border-t border-border-color">
        <ProductGrid title="NEW ARRIVALS" hideSidebar={true} />
      </section>

      {/* SECTION 7 - PROMISE STRIP */}
      <section className="py-16 border-t border-border-color">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">🔒</span>
              <h4 className="text-gold text-xs tracking-widest uppercase mb-2">Authenticity Guaranteed</h4>
              <p className="text-text-muted text-xs">100% verified luxury</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">🚚</span>
              <h4 className="text-gold text-xs tracking-widest uppercase mb-2">Premium Shipping</h4>
              <p className="text-text-muted text-xs">Worldwide secure delivery</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">↩️</span>
              <h4 className="text-gold text-xs tracking-widest uppercase mb-2">Easy Returns</h4>
              <p className="text-text-muted text-xs">Hassle-free 14 day returns</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-4">💎</span>
              <h4 className="text-gold text-xs tracking-widest uppercase mb-2">Exclusive Benefits</h4>
              <p className="text-text-muted text-xs">For registered members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
