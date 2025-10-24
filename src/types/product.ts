// src/types/product.ts
export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; // cents or plain — we will use plain for demo
  stock: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  sales?: number[]; // last 7 days for sparkline demo
}
