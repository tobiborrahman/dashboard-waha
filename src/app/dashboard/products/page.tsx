"use client";
import { useQuery } from "@tanstack/react-query";
import ProductTable from "@/components/products/index"
import Link from "next/link";

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      const json = await res.json();
      return json.data as any[];
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/dashboard/products/create" className="px-4 py-2 rounded bg-blue-600 text-white">Create Product</Link>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading products</div>
      ) : (
        <ProductTable data={data ?? []} />
      )}
    </div>
  );
}
