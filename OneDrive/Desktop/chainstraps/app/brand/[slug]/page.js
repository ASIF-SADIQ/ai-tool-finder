import { databases, Query, DB_ID, COL_ID } from "@/lib/appwrite";
import ProductGrid from "@/components/ProductGrid";
import { parseVendor } from "@/lib/helpers";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  return {
    title: `${parseVendor(params.slug).toUpperCase()} | Chain&Straps`,
  };
}

export default async function BrandPage({ params }) {
  const vendorName = parseVendor(params.slug);
  let products = [];

  try {
    const response = await databases.listDocuments(DB_ID, COL_ID, [
      Query.equal("vendor", vendorName),
      Query.equal("published", true),
      Query.limit(100)
    ]);
    products = response.documents;
  } catch (error) {
    console.error("Error fetching brand products:", error);
  }

  return (
    <div className="pt-24 min-h-screen bg-bg-primary">
      <div className="bg-bg-secondary py-20 border-b border-border-color flex items-center justify-center relative overflow-hidden">
        <h1 className="font-serif text-white text-5xl md:text-[6rem] uppercase tracking-wider relative z-10">
          {vendorName}
        </h1>
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/50 to-transparent z-0" />
      </div>
      <ProductGrid initialProducts={products} title={`${vendorName.toUpperCase()} Collection`} />
    </div>
  );
}
