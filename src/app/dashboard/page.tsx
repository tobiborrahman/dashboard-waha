'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductTable from '@/components/products/';
import OrderTable from '@/components/orders/OrderTable';
import { ShoppingCart, Box, CheckCircle, Clock } from 'lucide-react';
import {
	LineChart,
	Line,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	CartesianGrid,
	ResponsiveContainer,
	defs,
	linearGradient,
	stop,
} from 'recharts';

type Product = {
	id: string;
	name: string;
	price: number;
	stock: number;
	active: boolean;
	createdAt: string;
};

type Order = {
	id: string;
	clientName: string;
	productIds: string[];
	quantities: number[];
	totalAmount: number;
	paymentStatus: 'Paid' | 'Pending' | 'Refunded';
	createdAt: string;
};

export default function DashboardPage() {
	const { data: products = [], isLoading: loadingProducts } = useQuery({
		queryKey: ['products'],
		queryFn: async () => {
			const res = await fetch('/api/products');
			const json = await res.json();
			return json.data as Product[];
		},
	});

	const { data: orders = [], isLoading: loadingOrders } = useQuery({
		queryKey: ['orders'],
		queryFn: async () => {
			const res = await fetch('/api/orders');
			const json = await res.json();
			return json.data as Order[];
		},
	});

	const totalProducts = products.length;
	const totalOrders = orders.length;
	const deliveredOrders = orders.filter(
		(o) => o.paymentStatus === 'Paid'
	).length;
	const pendingOrders = orders.filter(
		(o) => o.paymentStatus === 'Pending'
	).length;
	const deliveredPercent = totalOrders
		? Math.round((deliveredOrders / totalOrders) * 100)
		: 0;

	const metricCards = [
		{
			title: 'Total Products',
			value: totalProducts,
			icon: <Box className="w-6 h-6" />,
			bgColor: 'bg-blue-500',
		},
		{
			title: 'Total Orders',
			value: totalOrders,
			icon: <ShoppingCart className="w-6 h-6" />,
			bgColor: 'bg-purple-500',
		},
		{
			title: 'Delivered Orders',
			value: `${deliveredPercent}%`,
			icon: <CheckCircle className="w-6 h-6" />,
			bgColor: 'bg-green-500',
		},
		{
			title: 'Pending Orders',
			value: pendingOrders,
			icon: <Clock className="w-6 h-6" />,
			bgColor: 'bg-yellow-500',
		},
	];
	// Chart Data (Last 30 days)
	const chartData = Array.from({ length: 30 }, (_, i) => {
		const date = new Date();
		date.setDate(date.getDate() - (29 - i));
		const dateString = date.toISOString().split('T')[0];

		const dayOrders = orders.filter((o) =>
			o.createdAt.startsWith(dateString)
		);
		const totalRevenue = dayOrders.reduce(
			(acc, o) => acc + o.totalAmount,
			0
		);
		const delivered = dayOrders.filter(
			(o) => o.paymentStatus === 'Paid'
		).length;
		const pending = dayOrders.filter(
			(o) => o.paymentStatus === 'Pending'
		).length;

		return { date: dateString, totalRevenue, delivered, pending };
	});

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-3xl font-bold">Dashboard</h1>

			{/* Metric Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{metricCards.map((card, idx) => (
					<Card
						key={idx}
						className="shadow hover:shadow-md transition relative overflow-hidden rounded-lg"
					>
						{/* Colored bar */}
						<div
							className={`absolute left-0 top-0 h-full w-1 ${card.bgColor}`}
						></div>

						<CardHeader className="pl-6 border-b-0 ">
							<CardTitle className="gap-2 border-0 flex justify-between items-center">
								{card.title}
								{card.icon}
							</CardTitle>
						</CardHeader>

						<CardContent className="pl-6 pb-5">
							<p className="text-5xl font-bold">{card.value}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Orders & Revenue Chart */}
			<Card className="bg-white shadow rounded-lg">
				<CardHeader className="border-b-0">
					<CardTitle>Orders & Revenue (Last 30 Days)</CardTitle>
				</CardHeader>
				<CardContent className="h-80 px-6">
					{orders.length === 0 ? (
						<p className="text-gray-500 text-center mt-16">
							No sales data
						</p>
					) : (
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={chartData}
								margin={{
									top: 10,
									right: 30,
									left: 0,
									bottom: 0,
								}}
							>
								<defs>
									<linearGradient
										id="colorRevenue"
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor="#3b82f6"
											stopOpacity={0.3}
										/>
										<stop
											offset="95%"
											stopColor="#3b82f6"
											stopOpacity={0}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="date" tick={{ fontSize: 12 }} />
								<YAxis
									yAxisId="left"
									tickFormatter={(v) => `$${v}`}
								/>
								<YAxis yAxisId="right" orientation="right" />
								<Tooltip
									formatter={(value: any) =>
										typeof value === 'number'
											? `$${value}`
											: value
									}
								/>
								<Legend />
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="delivered"
									stroke="#22c55e"
									name="Delivered Orders"
									dot={{ r: 3 }}
								/>
								<Line
									yAxisId="right"
									type="monotone"
									dataKey="pending"
									stroke="#facc15"
									name="Pending Orders"
									dot={{ r: 3 }}
								/>
								<Area
									yAxisId="left"
									type="monotone"
									dataKey="totalRevenue"
									stroke="#3b82f6"
									fill="url(#colorRevenue)"
									name="Revenue"
								/>
							</LineChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>

			{/* Tables */}
			<div>
				<Card className="bg-white shadow rounded-lg">
					<CardHeader>
						<CardTitle>Products</CardTitle>
					</CardHeader>
					<CardContent className='p-6'>
						{loadingProducts ? (
							<p>Loading products...</p>
						) : (
							<ProductTable data={products} />
						)}
					</CardContent>
				</Card>
			</div>
			<div className="rounded-lg">
				<Card className="bg-white shadow rounded-lg">
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<CardContent className='p-6'>
						{loadingOrders ? (
							<p>Loading orders...</p>
						) : (
							<OrderTable data={orders} />
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
