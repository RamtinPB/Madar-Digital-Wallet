export interface User {
	id: string;
	phoneNumber: string;
	userType: "CUSTOMER" | "BUSINESS" | "ADMIN";
	createdAt: string;
	updatedAt: string;
}
