export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number; 
  stock: number;
  description?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: string;
  sales?: number[];
}
