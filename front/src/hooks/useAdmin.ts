// Admin Authentication Hook for Madar Digital Wallet
import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { getMe } from "@/lib/api/auth";
import type { UserWithAdmin } from "@/types/auth";
import type { AdminType, AdminUserInfo } from "@/types/admin";

interface UseAdminReturn {
	isAdmin: boolean;
	adminInfo: AdminUserInfo | null;
	adminType: AdminType | null;
	permissions: string[];
	isLoading: boolean;
	hasPermission: (permission: string) => boolean;
	hasAnyPermission: (permissions: string[]) => boolean;
	refreshAdminInfo: () => Promise<void>;
}

/**
 * Custom hook to check admin status and permissions
 * This hook works with the JWT tokens and /auth/me response
 */
export function useAdmin(): UseAdminReturn {
	const { user, setUser, loading } = useAuthStore();
	const [adminInfo, setAdminInfo] = useState<AdminUserInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Parse admin info from user object
	useEffect(() => {
		if (!loading) {
			if (user && (user as UserWithAdmin).adminId) {
				const extendedUser = user as UserWithAdmin;
				setAdminInfo({
					adminId: extendedUser.adminId!,
					adminPublicId: extendedUser.adminPublicId!,
					adminType: extendedUser.adminType as AdminType,
					permissions: extendedUser.permissions || [],
					department: extendedUser.department,
				});
			} else {
				setAdminInfo(null);
			}
			setIsLoading(false);
		}
	}, [user, loading]);

	const isAdmin = !!adminInfo && !!adminInfo.adminId;

	const adminType = adminInfo?.adminType || null;
	const permissions = adminInfo?.permissions || [];

	/**
	 * Check if admin has a specific permission
	 * Supports wildcard (*) for full access
	 */
	const hasPermission = useCallback(
		(permission: string): boolean => {
			if (!isAdmin) return false;
			// Super admin has full access
			if (permissions.includes("*")) return true;
			return permissions.includes(permission);
		},
		[isAdmin, permissions],
	);

	/**
	 * Check if admin has any of the specified permissions
	 */
	const hasAnyPermission = useCallback(
		(requiredPermissions: string[]): boolean => {
			if (!isAdmin) return false;
			// Super admin has full access
			if (permissions.includes("*")) return true;
			return requiredPermissions.some((p) => permissions.includes(p));
		},
		[isAdmin, permissions],
	);

	/**
	 * Refresh admin info from server
	 */
	const refreshAdminInfo = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getMe();
			if (data?.user) {
				setUser(data.user as UserWithAdmin);
			}
		} finally {
			setIsLoading(false);
		}
	}, [setUser]);

	return {
		isAdmin,
		adminInfo,
		adminType,
		permissions,
		isLoading: isLoading || loading,
		hasPermission,
		hasAnyPermission,
		refreshAdminInfo,
	};
}

/**
 * Higher-order function to check admin permission
 * Use in components: requirePermission('users:read')
 */
export function requirePermission(permission: string) {
	return function useRequirePermission(): boolean {
		const { hasPermission } = useAdmin();
		return hasPermission(permission);
	};
}

/**
 * Hook to get admin navigation items based on permissions
 */
export function useAdminNavItems() {
	const { hasPermission, isAdmin } = useAdmin();

	if (!isAdmin) return [];

	const navItems = [];

	// Dashboard - all admins
	if (hasPermission("transactions:read") || hasPermission("*")) {
		navItems.push({
			key: "dashboard",
			name: "داشبورد",
			href: "/admin",
			icon: "LayoutDashboard",
		});
	}

	// Users - permission required
	if (hasPermission("users:read") || hasPermission("*")) {
		navItems.push({
			key: "users",
			name: "کاربران",
			href: "/admin/users",
			icon: "Users",
		});
	}

	// Transactions - permission required
	if (hasPermission("transactions:read") || hasPermission("*")) {
		navItems.push({
			key: "transactions",
			name: "تراکنش‌ها",
			href: "/admin/transactions",
			icon: "ArrowLeftRight",
		});
	}

	// Wallets - permission required
	if (hasPermission("wallets:read") || hasPermission("*")) {
		navItems.push({
			key: "wallets",
			name: "کیف پول‌ها",
			href: "/admin/wallets",
			icon: "Wallet",
		});
	}

	// Audit Logs - permission required
	if (hasPermission("audit:read") || hasPermission("*")) {
		navItems.push({
			key: "audit",
			name: "گزارشات",
			href: "/admin/audit",
			icon: "FileText",
		});
	}

	// Admins Management - only super admin
	if (hasPermission("admins:read") || hasPermission("*")) {
		navItems.push({
			key: "admins",
			name: "مدیران",
			href: "/admin/admins",
			icon: "Shield",
		});
	}

	return navItems;
}
