"use client";

import { useState, useEffect, useCallback } from "react";
import FilterSidebar from "./FilterSidebar";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { Filter } from "lucide-react";
import { API_BASE as API, API_BASE } from "@/lib/config";

export default function ProductGrid({ title, initialCategory }) {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 12;

  const [filters, setFilters] = useState({
    brands: [],
    categories: initialCategory ? [initialCategory] : [],
    price: [0, 5000000],
  });
  const [sort, setSort] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const buildQueryString = useCallback(
    (pageNum) => {
      const params = new URLSearchParams();
      params.set("limit", limit);
      params.set("skip", (pageNum - 1) * limit);

      if (filters.brands.length > 0) params.set("brand", filters.brands[0]);
      if (filters.categories && filters.categories.length > 0) {
        params.set("category", filters.categories.join(","));
      }
      if (sort === "price-low") params.set("sort", "price_asc");
      else if (sort === "price-high") params.set("sort", "price_desc");

      return params.toString();
    },
    [filters, sort]
  );

  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        if (!isLoadMore) setLoading(true);
        else setLoadingMore(true);

        const currentPage = isLoadMore ? page : 1;
        const res = await fetch(`${API_BASE}/products?${buildQueryString(currentPage)}`);
        const data = await res.json();

        const fetched = data.data || [];
        if (isLoadMore) {
          setProducts((prev) => [...prev, ...fetched]);
        } else {
          setProducts(fetched);
        }
        setTotal(data.total || 0);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, sort, page, buildQueryString]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(false);
  }, [filters, sort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(true);
  };

  return (
    <>
      <div className="container mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Desktop */}
        <div className="hidden md:block w-72 flex-shrink-0">
          <FilterSidebar onFilterChange={setFilters} currentFilters={filters} />
        </div>

        {/* Right Main Content */}
        <div className="flex-1">
          {/* Sorting & View Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b border-border-color">
            <h1 className="font-serif text-white text-3xl mb-4 md:mb-0">{title}</h1>
            <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-text-muted text-sm tracking-widest uppercase">
                {total.toLocaleString()} PIECES
              </span>
              <select
                className="bg-bg-secondary border border-border-color text-text-primary px-4 py-2 text-xs tracking-widest uppercase focus:outline-none focus:border-gold"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">NEWEST</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-text-muted">
              <p>No pieces match your criteria. Please adjust your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {products.length < total && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="luxury-button-outline px-10 py-4 text-sm font-bold disabled:opacity-50"
                  >
                    {loadingMore ? "LOADING..." : "LOAD MORE"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Fixed Filter Button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-bg-primary/95 backdrop-blur border-t border-border-color z-40">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-gold text-black w-full py-4 text-sm font-bold tracking-widest uppercase flex justify-center items-center"
        >
          <Filter size={18} className="mr-2" /> FILTER & SORT
        </button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-bg-primary flex flex-col">
          <FilterSidebar
            onFilterChange={setFilters}
            currentFilters={filters}
            isMobile
            onClose={() => setIsMobileFilterOpen(false)}
          />
        </div>
      )}
    </>
  );
}
