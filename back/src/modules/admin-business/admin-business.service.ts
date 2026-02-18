import { prisma } from "../../infrastructure/db/prisma.client";
import * as adminRepository from "../admin/admin.repository";
import { hasPermission } from "../../types/admin";

// List business users
export const listBusinessUsers = async (params: {
	page: number;
	limit: number;
	adminPermissions: string[];
}) => {
	if (!hasPermission(params.adminPermissions, "business:read")) {
		throw new Error("Insufficient permissions");
	}

	const { page, limit } = params;
	const skip = (page - 1) * limit;

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where: { userType: "BUSINESS" },
			skip,
			take: limit,
			select: {
				id: true,
				publicId: true,
				phoneNumber: true,
				userType: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.user.count({ where: { userType: "BUSINESS" } }),
	]);

	return {
		data: users,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

// Get business user details
export const getBusinessUserById = async (
	id: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "business:read")) {
		throw new Error("Insufficient permissions");
	}

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			publicId: true,
			phoneNumber: true,
			userType: true,
			createdAt: true,
		},
	});

	if (!user || user.userType !== "BUSINESS") {
		throw new Error("Business user not found");
	}

	return user;
};

// Get business user's wallets
export const getBusinessUserWallets = async (
	userId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "business:read")) {
		throw new Error("Insufficient permissions");
	}

	return prisma.wallet.findMany({
		where: { userId },
		select: {
			id: true,
			publicId: true,
			balance: true,
			primary: true,
			createdAt: true,
		},
	});
};

// Get business user's transactions
export const getBusinessUserTransactions = async (
	userId: number,
	params: { page: number; limit: number },
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "business:read")) {
		throw new Error("Insufficient permissions");
	}

	const { page, limit } = params;
	const skip = (page - 1) * limit;

	const wallets = await prisma.wallet.findMany({
		where: { userId },
		select: { id: true },
	});

	const walletIds = wallets.map((w) => w.id);

	const [transactions, total] = await Promise.all([
		prisma.transaction.findMany({
			where: {
				OR: [
					{ payerWalletId: { in: walletIds } },
					{ receiverWalletId: { in: walletIds } },
				],
			},
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
		}),
		prisma.transaction.count({
			where: {
				OR: [
					{ payerWalletId: { in: walletIds } },
					{ receiverWalletId: { in: walletIds } },
				],
			},
		}),
	]);

	return {
		data: transactions,
		pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
	};
};

// Verify business user
export const verifyBusinessUser = async (
	userId: number,
	adminId: number,
	adminPermissions: string[],
	notes?: string,
) => {
	if (!hasPermission(adminPermissions, "business:verify")) {
		throw new Error("Insufficient permissions");
	}

	await adminRepository.createAuditLog({
		adminId,
		action: "BUSINESS_VERIFIED",
		entityType: "User",
		entityId: userId,
		description: notes || "Business account verified",
	});

	return { success: true, message: "Business user verified" };
};

// Reject business user
export const rejectBusinessUser = async (
	userId: number,
	adminId: number,
	adminPermissions: string[],
	reason: string,
) => {
	if (!hasPermission(adminPermissions, "business:verify")) {
		throw new Error("Insufficient permissions");
	}

	await adminRepository.createAuditLog({
		adminId,
		action: "BUSINESS_REJECTED",
		entityType: "User",
		entityId: userId,
		description: reason,
	});

	return { success: true, message: "Business user rejected" };
};

// Get business analytics
export const getBusinessAnalytics = async (adminPermissions: string[]) => {
	if (!hasPermission(adminPermissions, "business:read")) {
		throw new Error("Insufficient permissions");
	}

	const total = await prisma.user.count({ where: { userType: "BUSINESS" } });

	return {
		totalBusinessUsers: total,
	};
};
