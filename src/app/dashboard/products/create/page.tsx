// app/dashboard/products/create/page.tsx
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
      // if payload.imageFile exists, you may upload to S3 or /api/upload. For demo we'll create object URL.
      let imageUrl = "";
      if (payload.imageFile) {
        // NOTE: demo-only: create local object url (not persisted across backend)
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
      qc.invalidateQueries(["products"]);
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
            // ProductForm passes imageFile
            await createMutation.mutateAsync(vals);
          }}
        />
      </div>
    </div>
  );
}
