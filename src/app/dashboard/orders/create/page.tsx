"use client";

import { useRouter } from "next/navigation";
import OrderForm, { OrderFormValues } from "@/forms/orders/OrderForm";
import toast from "react-hot-toast";

export default function CreateOrderPage() {
  const router = useRouter();

  const handleCreateOrder = async (values: OrderFormValues) => {
    try {
      // Calculate totalAmount
      const totalAmount = values.productIds.reduce((acc, pid, idx) => {
        // Ideally fetch product price from /api/products
        const price = 100; // placeholder
        const qty = values.quantities[idx] || 1;
        return acc + price * qty;
      }, 0);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, totalAmount }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      toast.success("Order created successfully!");
      router.push("/dashboard/orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create order");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create Order</h1>
      <OrderForm onSubmit={handleCreateOrder} />
    </div>
  );
}
