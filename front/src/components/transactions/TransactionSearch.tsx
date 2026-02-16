"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TransactionSearchProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function TransactionSearch({
	value,
	onChange,
	placeholder = "شماره تراکنش یا مبلغ...",
}: TransactionSearchProps) {
	const [localValue, setLocalValue] = useState(value);

	// Debounce search input (300ms)
	useEffect(() => {
		const timer = setTimeout(() => {
			if (localValue !== value) {
				onChange(localValue);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [localValue, onChange, value]);

	// Sync with external value changes
	useEffect(() => {
		setLocalValue(value);
	}, [value]);

	return (
		<div className="relative">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
			<Input
				type="text"
				placeholder={placeholder}
				value={localValue}
				onChange={(e) => setLocalValue(e.target.value)}
				className="pl-10"
				dir="rtl"
			/>
		</div>
	);
}
