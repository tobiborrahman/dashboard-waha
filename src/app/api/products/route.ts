// app/api/products/route.ts
import { NextResponse } from "next/server";
import type { Product } from "@/types/product";
import { uid } from "@/lib/generateId";

let DB: Product[] = [
  {
    id: uid("prod_"),
    name: "Wireless Headphones",
    sku: "WH-001",
    category: "Electronics",
    price: 99.99,
    stock: 120,
    description: "Comfortable wireless headphones.",
    imageUrl: "",
    active: true,
    createdAt: new Date().toISOString(),
    sales: [4, 6, 5, 8, 10, 6, 9],
  },
  // add more seed items as needed
];

export async function GET(request: Request) {
  // support simple query params: page, perPage, sortBy, order, filters...
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? 1);
  const perPage = Number(url.searchParams.get("perPage") ?? 10);

  const start = (page - 1) * perPage;
  const end = start + perPage;

  const data = DB.slice(start, end);

  return NextResponse.json({
    data,
    total: DB.length,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newProd: Product = {
    id: uid("prod_"),
    name: body.name,
    sku: body.sku,
    category: body.category,
    price: Number(body.price),
    stock: Number(body.stock),
    description: body.description,
    imageUrl: body.imageUrl ?? "",
    active: body.active ?? true,
    createdAt: new Date().toISOString(),
    sales: body.sales ?? [0,0,0,0,0,0,0],
  };
  DB.unshift(newProd);
  return NextResponse.json({ data: newProd }, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  DB = DB.filter((p) => p.id !== id);
  return NextResponse.json({ ok: true });
}
