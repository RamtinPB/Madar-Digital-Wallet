"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/api/admin";
import type { DashboardStats } from "@/types/admin";
import {
	Users,
	ArrowLeftRight,
	Wallet,
	DollarSign,
	TrendingUp,
	TrendingDown,
	Clock,
	AlertCircle,
	Shield,
} from "lucide-react";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<DashboardStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadStats();
	}, []);

	const loadStats = async () => {
		try {
			setLoading(true);
			const data = await getDashboardStats();
			setStats(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	};

	const formatNumber = (num: number) => {
		return new Intl.NumberFormat("fa-IR").format(num);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("fa-IR", {
			style: "currency",
			currency: "IRR",
			maximumFractionDigits: 0,
		}).format(amount);
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout>
				<div className="text-center py-8">
					<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
					<p className="text-red-500">{error}</p>
					<button
						onClick={loadStats}
						className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
					>
						تلاش مجدد
					</button>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">داشبورد</h1>
					<p className="text-muted-foreground">خلاصه وضعیت سیستم</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{/* Total Users */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">کل کاربران</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats ? formatNumber(stats.totalUsers) : "-"}
							</div>
							<p className="text-xs text-muted-foreground">
								{stats ? formatNumber(stats.activeUsers) : "-"} فعال
							</p>
						</CardContent>
					</Card>

					{/* Total Transactions */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">
								کل تراکنش‌ها
							</CardTitle>
							<ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats ? formatNumber(stats.totalTransactions) : "-"}
							</div>
							<p className="text-xs text-muted-foreground">
								{formatCurrency(stats?.totalVolume || 0)} حجم کل
							</p>
						</CardContent>
					</Card>

					{/* Today Stats */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">امروز</CardTitle>
							<TrendingUp className="h-4 w-4 text-green-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats ? formatNumber(stats.todayTransactions) : "-"}
							</div>
							<p className="text-xs text-muted-foreground">
								{formatCurrency(stats?.todayVolume || 0)} امروز
							</p>
						</CardContent>
					</Card>

					{/* Wallets */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">کیف پول‌ها</CardTitle>
							<Wallet className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats ? formatNumber(stats.totalWallets) : "-"}
							</div>
							<p className="text-xs text-muted-foreground">
								{stats ? formatNumber(stats.activeWallets) : "-"} فعال
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Additional Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{/* Pending Transactions */}
					<Card className="border-yellow-500">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">در انتظار</CardTitle>
							<Clock className="h-4 w-4 text-yellow-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-yellow-600">
								{stats ? formatNumber(stats.pendingTransactions) : "-"}
							</div>
						</CardContent>
					</Card>

					{/* Failed Transactions */}
					<Card className="border-red-500">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">ناموفق</CardTitle>
							<AlertCircle className="h-4 w-4 text-red-500" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-red-600">
								{stats ? formatNumber(stats.failedTransactions) : "-"}
							</div>
						</CardContent>
					</Card>

					{/* Admins */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">مدیران</CardTitle>
							<Shield className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">
								{stats ? formatNumber(stats.totalAdmins) : "-"}
							</div>
							<p className="text-xs text-muted-foreground">
								{stats ? formatNumber(stats.activeAdmins) : "-"} فعال
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Quick Actions */}
				<Card>
					<CardHeader>
						<CardTitle>دسترسی سریع</CardTitle>
					</CardHeader>
					<CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<a
							href="/admin/users"
							className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
						>
							<Users className="h-8 w-8 mb-2" />
							<span className="text-sm">مدیریت کاربران</span>
						</a>
						<a
							href="/admin/transactions"
							className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
						>
							<ArrowLeftRight className="h-8 w-8 mb-2" />
							<span className="text-sm">تراکنش‌ها</span>
						</a>
						<a
							href="/admin/wallets"
							className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
						>
							<Wallet className="h-8 w-8 mb-2" />
							<span className="text-sm">کیف پول‌ها</span>
						</a>
						<a
							href="/admin/audit"
							className="flex flex-col items-center justify-center p-4 border rounded-lg hover:bg-accent transition-colors"
						>
							<DollarSign className="h-8 w-8 mb-2" />
							<span className="text-sm">گزارشات</span>
						</a>
					</CardContent>
				</Card>
			</div>
		</AdminLayout>
	);
}
