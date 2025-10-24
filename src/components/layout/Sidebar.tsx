'use client';
import { useState } from 'react';
import { Home, Package, ShoppingCart, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
	{ name: 'Dashboard', icon: Home, href: '/dashboard' },
	{ name: 'Products', icon: Package, href: '/dashboard/products' },
	{ name: 'Orders', icon: ShoppingCart, href: '/dashboard/orders' },
	{ name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<aside
			className={`${
				collapsed ? 'w-16' : 'w-60'
			} h-screen bg-white dark:bg-sidebar shadow-md flex flex-col transition-all duration-300`}
		>
			<div className="flex items-center justify-between p-4 border-b border-gray-200">
				<h1 className={`font-bold text-xl ${collapsed && 'hidden'}`}>
					MyDashboard
				</h1>
				<button
					onClick={() => setCollapsed(!collapsed)}
					className="text-gray-600 hover:text-black rounded-md transition-colors"
				>
					{collapsed ? (
						<Menu className="w-6 h-6" />
					) : (
						<X className="w-6 h-6" />
					)}
				</button>
			</div>

			<nav className="flex-1 p-2">
				{menuItems.map(({ name, icon: Icon, href }) => (
					<Link
						key={name}
						href={href}
						className="flex items-center p-3 rounded-md hover:bg-gray-100 transition"
					>
						<Icon size={20} className="text-gray-600" />
						{!collapsed && <span className="ml-3">{name}</span>}
					</Link>
				))}
			</nav>
		</aside>
	);
}
