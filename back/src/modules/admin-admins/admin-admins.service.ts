import * as adminRepository from "../admin/admin.repository";
import { hasPermission, AdminType, AdminStatus } from "../../types/admin";

// List admins
export const listAdmins = async (params: {
	page: number;
	limit: number;
	adminType?: AdminType;
	status?: AdminStatus;
	adminPermissions: string[];
}) => {
	if (!hasPermission(params.adminPermissions, "admins:read")) {
		throw new Error("Insufficient permissions");
	}

	const { page, limit, adminType, status } = params;

	return adminRepository.listAdmins({ page, limit, adminType, status });
};

// Get admin by ID
export const getAdminById = async (id: number, adminPermissions: string[]) => {
	if (!hasPermission(adminPermissions, "admins:read")) {
		throw new Error("Insufficient permissions");
	}

	const admin = await adminRepository.findAdminById(id);
	if (!admin) {
		throw new Error("Admin not found");
	}

	return admin;
};

// Create new admin
export const createAdmin = async (
	params: { userId: number; adminType: AdminType; department?: string },
	adminId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "admins:write")) {
		throw new Error("Insufficient permissions");
	}

	const admin = await adminRepository.createAdmin(
		params.userId,
		params.adminType,
		params.department,
	);

	await adminRepository.createAuditLog({
		adminId,
		action: "ADMIN_CREATED",
		entityType: "Admin",
		entityId: admin.id,
		description: `Created admin with type ${params.adminType}`,
	});

	return admin;
};

// Update admin
export const updateAdmin = async (
	id: number,
	data: { adminType?: AdminType; department?: string; permissions?: string[] },
	adminId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "admins:write")) {
		throw new Error("Insufficient permissions");
	}

	const admin = await adminRepository.updateAdmin(id, data);

	await adminRepository.createAuditLog({
		adminId,
		action: "ADMIN_UPDATED",
		entityType: "Admin",
		entityId: id,
		description: "Admin details updated",
	});

	return admin;
};

// Suspend admin
export const suspendAdmin = async (
	id: number,
	adminId: number,
	adminPermissions: string[],
	reason?: string,
) => {
	if (!hasPermission(adminPermissions, "admins:suspend")) {
		throw new Error("Insufficient permissions");
	}

	const admin = await adminRepository.updateAdmin(id, { status: "SUSPENDED" });

	await adminRepository.createAuditLog({
		adminId,
		action: "ADMIN_SUSPENDED",
		entityType: "Admin",
		entityId: id,
		description: reason || "Admin suspended",
	});

	return admin;
};

// Unsuspend admin
export const unsuspendAdmin = async (
	id: number,
	adminId: number,
	adminPermissions: string[],
	reason?: string,
) => {
	if (!hasPermission(adminPermissions, "admins:suspend")) {
		throw new Error("Insufficient permissions");
	}

	const admin = await adminRepository.updateAdmin(id, { status: "ACTIVE" });

	await adminRepository.createAuditLog({
		adminId,
		action: "ADMIN_REACTIVATED",
		entityType: "Admin",
		entityId: id,
		description: reason || "Admin reactivated",
	});

	return admin;
};

// Delete admin
export const deleteAdmin = async (
	id: number,
	adminId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "admins:write")) {
		throw new Error("Insufficient permissions");
	}

	await adminRepository.deleteAdmin(id);

	await adminRepository.createAuditLog({
		adminId,
		action: "ADMIN_DELETED",
		entityType: "Admin",
		entityId: id,
		description: "Admin deleted",
	});

	return { success: true };
};
