"use client";

import { useEffect, useState } from "react";
import { Search, Package } from "lucide-react";
import { API_BASE } from "@/lib/config";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products?limit=100`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const title = (p.Title || p.title || "").toLowerCase();
    const vendor = (p.Vendor || p.vendor || "").toLowerCase();
    return !search || title.includes(search.toLowerCase()) || vendor.includes(search.toLowerCase());
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-light tracking-wide">Products</h1>
        <p className="text-[#666] text-sm mt-1">{products.length} products in store</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#b8972e] transition-colors placeholder-[#444] rounded max-w-md"
        />
      </div>

      <div className="bg-[#111] border border-[#222] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-[#555] tracking-widest uppercase text-xs animate-pulse">Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center text-[#555] tracking-widest uppercase text-xs">No products found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left px-6 py-4 text-[#555] text-xs tracking-widest uppercase">Product</th>
                  <th className="text-left px-6 py-4 text-[#555] text-xs tracking-widest uppercase">Brand</th>
                  <th className="text-left px-6 py-4 text-[#555] text-xs tracking-widest uppercase">Price</th>
                  <th className="text-left px-6 py-4 text-[#555] text-xs tracking-widest uppercase">Handle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const images = Array.isArray(product.images) ? product.images : [];
                  const image = images[0] || product["Image Src"] || null;
                  const title = product.Title || product.title || "Untitled";
                  const vendor = product.Vendor || product.vendor || "—";
                  const price = product["Variant Price"] || product.price || 0;
                  const handle = product.Handle || product.handle || product._id;

                  return (
                    <tr key={product._id} className="border-b border-[#1a1a1a] hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={title} className="w-10 h-12 object-cover flex-shrink-0 bg-[#0a0a0a]" />
                          ) : (
                            <div className="w-10 h-12 bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-[#444]" />
                            </div>
                          )}
                          <p className="text-white text-sm line-clamp-1">{title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#b8972e] text-xs tracking-wider uppercase">{vendor}</td>
                      <td className="px-6 py-4 text-white text-sm">${Number(price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-[#555] text-xs font-mono line-clamp-1 max-w-[200px]">{handle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
