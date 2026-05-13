"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { databases, Query, DB_ID, COL_ID } from "@/lib/appwrite";
import Link from "next/link";
import { formatPrice, parseImages } from "@/lib/helpers";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await databases.listDocuments(DB_ID, COL_ID, [
          Query.search("title", query),
          Query.equal("published", true),
          Query.limit(6) // limit for auto-suggest
        ]);
        setResults(response.documents);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-bg-primary/95 backdrop-blur-md flex flex-col"
        >
          <div className="container mx-auto px-4 md:px-8 py-8 relative flex-1 flex flex-col">
            <button 
              onClick={onClose}
              className="absolute top-8 right-4 md:right-8 text-text-secondary hover:text-white transition-colors"
            >
              <X size={32} />
            </button>

            <div className="max-w-4xl mx-auto w-full mt-12 md:mt-24">
              <div className="relative border-b border-gold pb-4 mb-12">
                <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gold" size={32} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="SEARCH FOR DESIGNERS, BAGS, SHOES..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-white text-2xl md:text-4xl lg:text-5xl font-light placeholder-text-muted focus:outline-none pl-14 tracking-widest uppercase"
                />
              </div>

              {loading && query.length >= 2 && (
                <div className="text-center text-gold tracking-widest uppercase animate-pulse">
                  Searching...
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="animate-fade-up">
                  <h3 className="text-gold text-xs tracking-widest uppercase mb-6">Suggestions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {results.map((product) => {
                      const images = parseImages(product.images);
                      const mainImage = images.length > 0 ? images[0] : "/placeholder.png";

                      return (
                        <Link 
                          key={product.$id} 
                          href={`/product/${product.handle}`}
                          onClick={onClose}
                          className="group flex space-x-4 items-center bg-bg-secondary p-4 hover:bg-bg-tertiary transition-colors border border-transparent hover:border-border-color"
                        >
                          <div className="w-16 h-20 bg-black flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mainImage} alt={product.title} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-gold text-[10px] tracking-widest uppercase mb-1">{product.vendor}</p>
                            <h4 className="text-white text-sm font-light line-clamp-1 group-hover:text-gold transition-colors">{product.title}</h4>
                            <p className="text-text-muted text-xs mt-1">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-12 text-center">
                    <Link 
                      href={`/search?q=${encodeURIComponent(query)}`} 
                      onClick={onClose}
                      className="text-white border-b border-gold pb-1 text-xs tracking-widest uppercase hover:text-gold transition-colors"
                    >
                      View All Results for "{query}"
                    </Link>
                  </div>
                </div>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <div className="text-center text-text-muted text-sm tracking-widest uppercase">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
