// Format number to Persian/Arabic numerals
export function formatNumber(num: number): string {
	return num.toLocaleString("fa-IR");
}

// Format currency in Tomans (Iranian Rial)
export function formatCurrency(amount: number | string): string {
	const num = typeof amount === "string" ? parseFloat(amount) : amount;
	if (isNaN(num)) return "۰";
	return `${formatNumber(num)} تومان`;
}

// Format wallet ID for display
export function formatWalletId(publicId: string): string {
	// Show last 8 characters
	if (publicId.length <= 8) return publicId;
	return publicId.slice(-8);
}
