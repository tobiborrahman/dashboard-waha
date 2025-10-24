"use client";
import ProductForm from "@/forms/products/ProductForm";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProductCreatePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      let imageUrl = "";
      if (payload.imageFile) {
        imageUrl = URL.createObjectURL(payload.imageFile);
      }
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, imageUrl }),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ["products"]});
      toast.success("Product created");
      router.push("/dashboard/products");
    },
    onError: () => {
      toast.error("Could not create product");
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <ProductForm
          onSubmit={async (vals) => {
            await createMutation.mutateAsync(vals);
          }}
        />
      </div>
    </div>
  );
}
