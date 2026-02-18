export interface User {
	id: string;
	phoneNumber: string;
	userType: "CUSTOMER" | "BUSINESS" | "ADMIN";
	createdAt: string;
	updatedAt: string;
}

/**
 * Extended user with admin info (returned from /auth/me for admins)
 */
export interface UserWithAdmin extends User {
	adminId?: number;
	adminPublicId?: string;
	adminType?: string;
	permissions?: string[];
	department?: string;
}
