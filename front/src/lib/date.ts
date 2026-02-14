// Persian relative time formatting
export function getRelativeTime(date: Date | string): string {
	const now = new Date();
	const target = new Date(date);
	const diffMs = now.getTime() - target.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	// Persian time units
	if (diffSeconds < 60) {
		return "همین الان";
	} else if (diffMinutes < 60) {
		return `${diffMinutes} دقیقه پیش`;
	} else if (diffHours < 24) {
		return `${diffHours} ساعت پیش`;
	} else if (diffDays === 1) {
		return "دیروز";
	} else if (diffDays < 7) {
		return `${diffDays} روز پیش`;
	} else if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks} هفته پیش`;
	} else if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months} ماه پیش`;
	} else {
		const years = Math.floor(diffDays / 365);
		return `${years} سال پیش`;
	}
}

// Format date for display
export function formatDate(date: Date | string): string {
	const target = new Date(date);
	return target.toLocaleDateString("fa-IR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
