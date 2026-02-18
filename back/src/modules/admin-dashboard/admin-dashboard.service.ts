import { prisma } from "../../infrastructure/db/prisma.client";
import { hasPermission } from "../../types/admin";

// Get dashboard statistics
export const getDashboardStats = async (adminPermissions: string[]) => {
	if (!hasPermission(adminPermissions, "dashboard:view")) {
		throw new Error("Insufficient permissions");
	}

	const [totalUsers, totalTransactions, totalBusinessUsers, totalAdmins] =
		await Promise.all([
			prisma.user.count(),
			prisma.transaction.count(),
			prisma.user.count({ where: { userType: "BUSINESS" } }),
			prisma.admin.count(),
		]);

	// Calculate total wallet balance
	const wallets = await prisma.wallet.aggregate({
		_sum: { balance: true },
	});

	return {
		totalUsers,
		totalTransactions,
		totalBusinessUsers,
		totalAdmins,
		totalBalance: wallets._sum.balance || 0,
	};
};

// Get chart data
export const getDashboardCharts = async (
	params: { days?: number },
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "dashboard:view")) {
		throw new Error("Insufficient permissions");
	}

	const days = params.days || 30;
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	// Get daily transaction counts
	const transactions = await prisma.transaction.findMany({
		where: {
			createdAt: { gte: startDate },
		},
		select: {
			createdAt: true,
			transactionType: true,
			amount: true,
		},
	});

	// Group by date
	const dailyData: Record<string, { count: number; volume: number }> = {};

	transactions.forEach((tx) => {
		const date = tx.createdAt.toISOString().split("T")[0] as string;
		if (!dailyData[date]) {
			dailyData[date] = { count: 0, volume: 0 };
		}
		dailyData[date]!.count++;
		dailyData[date]!.volume += Number(tx.amount);
	});

	return {
		dailyTransactions: Object.entries(dailyData).map(([date, data]) => ({
			date,
			count: data.count,
			volume: data.volume,
		})),
	};
};
