"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Wallet,
	ArrowUp,
	ArrowDown,
	ArrowUpDown,
	MoreVertical,
	Eye,
	Edit,
	Trash2,
	Star,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Wallet as WalletType } from "@/types/wallet";
import { formatCurrency } from "@/lib/format";

interface WalletCardProps {
	wallet: WalletType;
	onDeposit?: (wallet: WalletType) => void;
	onWithdraw?: (wallet: WalletType) => void;
	onTransfer?: (wallet: WalletType) => void;
	onDelete?: (wallet: WalletType) => void;
	isDefault?: boolean;
}

export function WalletCard({
	wallet,
	onDeposit,
	onWithdraw,
	onTransfer,
	onDelete,
	isDefault = false,
}: WalletCardProps) {
	// Format wallet public ID for display
	const formatPublicId = (publicId: string) => {
		if (publicId.length <= 8) return publicId;
		return `****${publicId.slice(-8)}`;
	};

	return (
		<Card className="hover:shadow-md transition-shadow">
			<CardContent className="p-4 space-y-4">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Link
						href={`/wallets/${wallet.id}`}
						className="flex items-center gap-2 hover:underline"
					>
						<Wallet className="h-5 w-5 text-primary" />
						<span className="font-medium">
							{wallet.name || `کیف پول ${wallet.id}`}
						</span>
					</Link>
					{isDefault && (
						<Badge variant="secondary" className="flex items-center gap-1">
							<Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
							پیش‌فرض
						</Badge>
					)}
				</div>

				{/* Balance */}
				<Link href={`/wallets/${wallet.id}`} className="block">
					<div className="text-2xl font-bold">
						{formatCurrency(wallet.balance)}
					</div>
					<div className="text-sm text-muted-foreground font-mono">
						{formatPublicId(wallet.publicId)}
					</div>
					<div className="text-xs text-muted-foreground mt-1">
						ایجاد: {new Date(wallet.createdAt).toLocaleDateString("fa-IR")}
					</div>
				</Link>

				{/* Actions */}
				<div className="flex gap-2 flex-wrap">
					{onDeposit && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => onDeposit(wallet)}
						>
							<ArrowDown className="h-3 w-3 ml-1" />
							افزایش
						</Button>
					)}
					{onWithdraw && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => onWithdraw(wallet)}
						>
							<ArrowUp className="h-3 w-3 ml-1" />
							برداشت
						</Button>
					)}
					{onTransfer && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => onTransfer(wallet)}
						>
							<ArrowUpDown className="h-3 w-3 ml-1" />
							انتقال
						</Button>
					)}
				</div>

				{/* More Menu */}
				<div className="flex justify-end">
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon-sm">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem asChild>
								<Link href={`/wallets/${wallet.id}`}>
									<Eye className="h-4 w-4 ml-2" />
									مشاهده جزئیات
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Edit className="h-4 w-4 ml-2" />
								ویرایش نام
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => onDelete?.(wallet)}
							>
								<Trash2 className="h-4 w-4 ml-2" />
								حذف کیف پول
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>
		</Card>
	);
}
