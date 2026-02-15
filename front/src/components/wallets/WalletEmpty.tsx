"use client";

import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus } from "lucide-react";

interface WalletEmptyProps {
	onCreateWallet?: () => void;
}

export function WalletEmpty({ onCreateWallet }: WalletEmptyProps) {
	const router = useRouter();

	const handleCreateWallet = () => {
		if (onCreateWallet) {
			onCreateWallet();
		} else {
			router.push("/wallets/create");
		}
	};

	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-12">
				<Wallet className="h-16 w-16 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">شما هنوز کیف پول ندارید</h3>
				<p className="text-muted-foreground mb-4 text-center max-w-sm">
					برای شروع، اولین کیف پول خود را ایجاد کنید. با داشتن کیف پول می‌توانید
					موجودی خود را مدیریت کنید و تراکنش‌های مالی انجام دهید.
				</p>
				<Button onClick={handleCreateWallet}>
					<Plus className="h-4 w-4 ml-2" />
					ایجاد کیف پول جدید
				</Button>
			</CardContent>
		</Card>
	);
}
