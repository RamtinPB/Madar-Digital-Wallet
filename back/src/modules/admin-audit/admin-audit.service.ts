import * as adminRepository from "../admin/admin.repository";
import { hasPermission } from "../../types/admin";

// Get audit logs
export const getAuditLogs = async (params: {
	page: number;
	limit: number;
	adminId?: number;
	action?: string;
	entityType?: string;
	adminPermissions: string[];
}) => {
	if (!hasPermission(params.adminPermissions, "audit:read")) {
		throw new Error("Insufficient permissions");
	}

	const { page, limit, adminId, action, entityType } = params;

	return adminRepository.getAuditLogs({
		page,
		limit,
		adminId,
		action,
		entityType,
	});
};

// Get single audit log
export const getAuditLogById = async (
	id: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "audit:read")) {
		throw new Error("Insufficient permissions");
	}

	const log = await adminRepository.getAuditLogById(id);
	if (!log) {
		throw new Error("Audit log not found");
	}

	return log;
};

// Export audit logs (returns data for CSV export)
export const exportAuditLogs = async (params: {
	adminId?: number;
	action?: string;
	entityType?: string;
	startDate?: Date;
	endDate?: Date;
	adminPermissions: string[];
}) => {
	if (!hasPermission(params.adminPermissions, "audit:export")) {
		throw new Error("Insufficient permissions");
	}

	// Get all matching logs (without pagination for export)
	const logs = await adminRepository.getAuditLogs({
		page: 1,
		limit: 10000, // Large limit for export
		adminId: params.adminId,
		action: params.action,
		entityType: params.entityType,
	});

	return logs.data;
};
