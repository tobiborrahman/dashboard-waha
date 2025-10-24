"use client";

import { useQuery } from "@tanstack/react-query";
import OrderTable from "@/components/orders/OrderTable";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      const json = await res.json();
      return json.data as any[];
    },
    refetchOnWindowFocus: false,
  });

  const handleAddOrder = (order: any) => {
    // For simplicity, just add to current data array
    if (orders) orders.unshift(order);
    setShowForm(false);
  };

  const handleDeleteOrder = (id: string) => {
    if (orders) {
      const index = orders.findIndex((o) => o.id === id);
      if (index > -1) orders.splice(index, 1);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/dashboard/orders/create" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Create Order
        </Link>
      </div>

      {isLoading ? (
        <div>Loading orders...</div>
      ) : error ? (
        <div>Error loading orders</div>
      ) : (
        <OrderTable data={orders ?? []} onDelete={handleDeleteOrder} />
      )}
    </div>
  );
}
