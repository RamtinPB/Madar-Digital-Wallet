"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { depositToWallet } from "@/lib/api/wallet";
import type { Wallet } from "@/types/wallet";
import { formatCurrency } from "@/lib/format";
import { ArrowDown, Loader2 } from "lucide-react";

interface DepositModalProps {
	isOpen: boolean;
	onClose: () => void;
	wallet?: Wallet | null;
	wallets: Wallet[];
	onSuccess?: () => void;
}

export function DepositModal({
	isOpen,
	onClose,
	wallet,
	wallets,
	onSuccess,
}: DepositModalProps) {
	const [selectedWalletId, setSelectedWalletId] = useState<string>(
		wallet?.id.toString() || "",
	);
	const [amount, setAmount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Reset state when modal opens
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
			setSelectedWalletId(wallet?.id.toString() || "");
			setAmount("");
			setError(null);
		} else if (wallet) {
			setSelectedWalletId(wallet.id.toString());
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedWalletId) {
			setError("لطفا کیف پول را انتخاب کنید");
			return;
		}

		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			setError("لطفا مبلغ معتبر وارد کنید");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			await depositToWallet(parseInt(selectedWalletId), amountNum);
			onSuccess?.();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در واریز وجه");
		} finally {
			setIsLoading(false);
		}
	};

	// Get selected wallet for display
	const selectedWallet = wallets.find(
		(w) => w.id.toString() === selectedWalletId,
	);

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ArrowDown className="h-5 w-5 text-green-600" />
						افزایش موجودی
					</DialogTitle>
					<DialogDescription>
						مبلغ را به کیف پول خود واریز کنید
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Wallet Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium">انتخاب کیف پول</label>
						<Select
							value={selectedWalletId}
							onValueChange={setSelectedWalletId}
						>
							<SelectTrigger>
								<SelectValue placeholder="انتخاب کیف پول" />
							</SelectTrigger>
							<SelectContent>
								{wallets.map((w) => (
									<SelectItem key={w.id} value={w.id.toString()}>
										{w.name || `کیف پول ${w.id}`} - {formatCurrency(w.balance)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Amount Input */}
					<div className="space-y-2">
						<label className="text-sm font-medium">مبلغ (تومان)</label>
						<Input
							type="number"
							placeholder="مبلغ را وارد کنید"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							min="1000"
							step="1000"
						/>
					</div>

					{/* Selected Wallet Balance Display */}
					{selectedWallet && (
						<div className="bg-muted p-3 rounded-lg text-sm">
							<p className="text-muted-foreground">موجودی فعلی:</p>
							<p className="font-semibold">
								{formatCurrency(selectedWallet.balance)}
							</p>
						</div>
					)}

					{/* Error Message */}
					{error && (
						<p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
							{error}
						</p>
					)}

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isLoading}
						>
							انصراف
						</Button>
						<Button type="submit" disabled={isLoading || !selectedWalletId}>
							{isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
							تایید و واریز
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
