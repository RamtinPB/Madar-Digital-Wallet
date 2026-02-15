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
import { transferFunds } from "@/lib/api/wallet";
import type { Wallet } from "@/types/wallet";
import { formatCurrency } from "@/lib/format";
import { ArrowUpDown, Loader2, AlertTriangle } from "lucide-react";

interface TransferModalProps {
	isOpen: boolean;
	onClose: () => void;
	wallet?: Wallet | null;
	wallets: Wallet[];
	onSuccess?: () => void;
}

export function TransferModal({
	isOpen,
	onClose,
	wallet,
	wallets,
	onSuccess,
}: TransferModalProps) {
	const [fromWalletId, setFromWalletId] = useState<string>(
		wallet?.id.toString() || "",
	);
	const [toWalletId, setToWalletId] = useState("");
	const [amount, setAmount] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Get selected wallet
	const fromWallet = wallets.find((w) => w.id.toString() === fromWalletId);
	const toWallet = wallets.find((w) => w.id.toString() === toWalletId);

	// Filter out the source wallet from destination options
	const availableDestinationWallets = wallets.filter(
		(w) => w.id.toString() !== fromWalletId,
	);

	// Check if transfer amount is valid
	const transferAmount = parseFloat(amount) || 0;
	const canTransfer =
		fromWallet && transferAmount <= parseFloat(fromWallet.balance);

	// Reset state when modal opens
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			onClose();
			setFromWalletId(wallet?.id.toString() || "");
			setToWalletId("");
			setAmount("");
			setError(null);
		} else if (wallet) {
			setFromWalletId(wallet.id.toString());
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!fromWalletId) {
			setError("لطفا کیف پول مبدا را انتخاب کنید");
			return;
		}

		if (!toWalletId) {
			setError("لطفا کیف پول مقصد را انتخاب کنید");
			return;
		}

		if (fromWalletId === toWalletId) {
			setError("کیف پول مبدا و مقصد نمی‌توانند یکسان باشند");
			return;
		}

		const amountNum = parseFloat(amount);
		if (isNaN(amountNum) || amountNum <= 0) {
			setError("لطفا مبلغ معتبر وارد کنید");
			return;
		}

		if (!canTransfer) {
			setError("موجودی کافی نیست");
			return;
		}

		try {
			setIsLoading(true);
			setError(null);
			await transferFunds(
				parseInt(fromWalletId),
				parseInt(toWalletId),
				amountNum,
			);
			onSuccess?.();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در انتقال وجه");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ArrowUpDown className="h-5 w-5 text-blue-600" />
						انتقال بین کیف پول‌ها
					</DialogTitle>
					<DialogDescription>
						مبلغ را به کیف پول دیگری انتقال دهید
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Source Wallet Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium">کیف پول مبدا</label>
						<Select value={fromWalletId} onValueChange={setFromWalletId}>
							<SelectTrigger>
								<SelectValue placeholder="انتخاب کیف پول مبدا" />
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

					{/* Destination Wallet Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium">کیف پول مقصد</label>
						<Select
							value={toWalletId}
							onValueChange={setToWalletId}
							disabled={availableDestinationWallets.length === 0}
						>
							<SelectTrigger>
								<SelectValue placeholder="انتخاب کیف پول مقصد" />
							</SelectTrigger>
							<SelectContent>
								{availableDestinationWallets.map((w) => (
									<SelectItem key={w.id} value={w.id.toString()}>
										{w.name || `کیف پول ${w.id}`}
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

					{/* Transfer Summary */}
					{fromWallet && amount && (
						<div className="bg-muted p-3 rounded-lg text-sm space-y-2">
							<div className="flex justify-between">
								<p className="text-muted-foreground">موجودی مبدا:</p>
								<p className="font-semibold">
									{formatCurrency(fromWallet.balance)}
								</p>
							</div>
							<div className="flex justify-between">
								<p className="text-muted-foreground">مبلغ انتقال:</p>
								<p className="font-semibold text-blue-600">
									-{formatCurrency(amount)}
								</p>
							</div>
							<div className="flex justify-between border-t pt-2">
								<p className="text-muted-foreground">موجودی جدید:</p>
								<p
									className={`font-semibold ${
										canTransfer ? "" : "text-destructive"
									}`}
								>
									{formatCurrency(
										parseFloat(fromWallet.balance) - transferAmount,
									)}
								</p>
							</div>
						</div>
					)}

					{/* Insufficient Balance Warning */}
					{fromWallet && amount && !canTransfer && (
						<div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
							<AlertTriangle className="h-4 w-4" />
							موجودی کافی نیست
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
						<Button
							type="submit"
							disabled={
								isLoading || !fromWalletId || !toWalletId || !canTransfer
							}
						>
							{isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
							تایید و انتقال
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
