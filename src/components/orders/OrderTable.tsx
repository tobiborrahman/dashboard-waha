'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';
import { useQuery } from '@tanstack/react-query';

type OrderItem = {
	productId: string;
	quantity: number;
	price: number;
};

interface Product {
	id: string;
	name: string;
	price: number;
}

interface OrderTableProps {
	data: Order[];
	onDelete?: (id: string) => void;
}

export default function OrderTable({ data, onDelete }: OrderTableProps) {
	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('/api/products');
			const json = await res.json();
			return json.data as Product[];
		},
	});

	if (!data?.length) {
		return (
			<Card className="shadow-sm">
				<CardContent className="p-8 text-center text-gray-500">
					No orders found.
				</CardContent>
			</Card>
		);
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'Delivered':
				return 'bg-green-100 text-green-800';
			case 'Shipped':
				return 'bg-blue-100 text-blue-800';
			case 'Cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-yellow-100 text-yellow-800';
		}
	};

	const getProductName = (id: string) => {
		return products?.find((p) => p.id === id)?.name ?? 'Unknown';
	};

	return (
		<Card className="shadow-sm p-0 rounded-none">
			<CardContent className="p-0 overflow-x-auto">
				<table className="min-w-full text-sm text-left">
					<thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold tracking-wider">
						<tr>
							<th className="px-5 py-3">Order ID</th>
							<th className="px-5 py-3">Customer</th>
							<th className="px-5 py-3">Products</th>
							<th className="px-5 py-3">Total</th>
							<th className="px-5 py-3">Status</th>
							<th className="px-5 py-3">Created</th>
							<th className="px-5 py-3 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
						{data.map(
							(order) => (
								console.log(order),
								(
									<tr
										key={order.id}
										className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors border-b-[.5px] border-gray-200 dark:border-gray-700"
									>
										<td className="px-5 py-3 font-mono text-xs text-gray-700 dark:text-gray-300">
											{order.id}
										</td>
										<td className="px-5 py-3 font-medium text-gray-900 dark:text-gray-100">
											{order.clientName}
										</td>
										<td className="px-5 py-3 text-gray-700 dark:text-gray-300">
											{order.products
												?.map(
													(product) =>
														`${product.name} (qty: ${product.quantities})`
												)
												.join(', ')}
										</td>
										<td className="px-5 py-3 font-semibold text-gray-900 dark:text-gray-100">
											${order.totalAmount.toFixed(2)}
										</td>
										<td className="px-5 py-3">
											<span
												className={cn(
													'px-2 py-1 rounded-full text-xs font-medium',
													getStatusColor(
														order.paymentStatus
													)
												)}
											>
												{order.paymentStatus}
											</span>
										</td>
										<td className="px-5 py-3 text-gray-500 dark:text-gray-400">
											{new Date(
												order.createdAt
											).toLocaleDateString()}
										</td>
										<td className="px-5 py-3 text-right">
											<Button
												size="sm"
												variant="destructive"
												onClick={() =>
													onDelete?.(order.id)
												}
											>
												Delete
											</Button>
										</td>
									</tr>
								)
							)
						)}
					</tbody>
				</table>
			</CardContent>
		</Card>
	);
}
