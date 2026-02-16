import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Plus, Wallet } from "lucide-react";

interface QuickActionsProps {
	onDeposit: () => void;
	onWithdraw: () => void;
	onTransfer: () => void;
	onCreateWallet: () => void;
}

export function QuickActions({
	onDeposit,
	onWithdraw,
	onTransfer,
	onCreateWallet,
}: QuickActionsProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						className="flex flex-col items-center gap-1 h-auto py-3"
						onClick={onDeposit}
					>
						<ArrowDown className="h-5 w-5 text-green-700" />
						<span className="text-sm">افزایش موجودی</span>
					</Button>
					<Button
						variant="outline"
						className="flex flex-col items-center gap-1 h-auto py-3"
						onClick={onWithdraw}
					>
						<ArrowUp className="h-5 w-5 text-orange-600" />
						<span className="text-sm">برداشت</span>
					</Button>
					<Button
						variant="outline"
						className="flex flex-col items-center gap-1 h-auto py-3"
						onClick={onTransfer}
					>
						<ArrowUpDown className="h-5 w-5 text-blue-600" />
						<span className="text-sm">انتقال</span>
					</Button>
					<Button
						variant="outline"
						className="flex flex-col items-center gap-1 h-auto py-3"
						onClick={onCreateWallet}
					>
						<Plus className="h-5 w-5 text-amber-500" />
						<span className="text-sm">کیف‌ پول جدید</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
