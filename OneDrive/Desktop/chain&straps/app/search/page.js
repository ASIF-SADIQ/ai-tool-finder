import { databases, Query, DB_ID, COL_ID } from "@/lib/appwrite";
import ProductGrid from "@/components/ProductGrid";
import { Search } from "lucide-react";

export const metadata = {
  title: "Search | Chain&Straps",
};

export default async function SearchPage({ searchParams }) {
  const query = searchParams?.q || "";
  let products = [];

  if (query) {
    try {
      // Appwrite full-text search requires a full-text index on the searched attributes
      // Assuming a full-text index exists on title, vendor, tags
      const response = await databases.listDocuments(DB_ID, COL_ID, [
        Query.search("title", query),
        Query.equal("published", true),
        Query.limit(50)
      ]);
      products = response.documents;
    } catch (error) {
      console.error("Error searching products:", error);
    }
  }

  return (
    <div className="pt-24 min-h-screen bg-bg-primary">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <form className="max-w-2xl mx-auto mb-16 relative" action="/search">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search for designers, bags, shoes..."
            className="w-full bg-bg-secondary border border-border-color px-6 py-4 text-white text-lg focus:outline-none focus:border-gold transition-colors pl-14"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text-muted" size={24} />
          <button type="submit" className="absolute right-2 top-2 bottom-2 luxury-button px-6 text-xs">
            Search
          </button>
        </form>

        {query ? (
          <div>
            <h2 className="font-serif text-white text-3xl mb-8 border-b border-border-color pb-4">
              Results for &quot;{query}&quot; ({products.length})
            </h2>
            {products.length > 0 ? (
              <ProductGrid initialProducts={products} title="Search Results" showFilter={false} />
            ) : (
              <div className="text-center py-20 bg-bg-secondary border border-border-color">
                <p className="text-text-muted mb-4">No products found matching your search.</p>
                <a href="/all" className="text-gold text-sm tracking-widest uppercase hover:underline">
                  Browse all products
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <Search className="mx-auto mb-4 opacity-50" size={48} strokeWidth={1} />
            <p>Enter a search term to find products</p>
          </div>
        )}
      </div>
    </div>
  );
}
