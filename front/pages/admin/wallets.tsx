"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	getAdminWallets,
	adjustWalletBalance,
	updateWalletStatus,
	type AdminWalletsParams,
} from "@/lib/api/admin";
import type { AdminWallet, WalletStatus } from "@/types/admin";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import {
	Search,
	RefreshCw,
	AlertCircle,
	Plus,
	Minus,
	PauseCircle,
	PlayCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminWalletsPage() {
	const [wallets, setWallets] = useState<AdminWallet[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	// Adjust balance dialog
	const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(
		null,
	);
	const [adjustType, setAdjustType] = useState<"INCREASE" | "DECREASE">(
		"INCREASE",
	);
	const [adjustAmount, setAdjustAmount] = useState("");
	const [adjustReason, setAdjustReason] = useState("");
	const [adjusting, setAdjusting] = useState(false);

	useEffect(() => {
		loadWallets();
	}, [page, status]);

	const loadWallets = async () => {
		try {
			setLoading(true);
			const params: AdminWalletsParams = {
				page,
				limit: 20,
				search: search || undefined,
				status: status !== "all" ? (status as WalletStatus) : undefined,
			};
			const response = await getAdminWallets(params);
			setWallets(response.wallets);
			setTotalPages(response.totalPages);
			setTotal(response.total);
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = () => {
		setPage(1);
		loadWallets();
	};

	const handleAdjust = async () => {
		if (!selectedWallet) return;
		try {
			setAdjusting(true);
			await adjustWalletBalance(
				selectedWallet.id,
				parseFloat(adjustAmount),
				adjustReason,
				adjustType,
			);
			toast.success("موجودی با موفقیت تعدیل شد");
			setAdjustDialogOpen(false);
			setAdjustAmount("");
			setAdjustReason("");
			setSelectedWallet(null);
			loadWallets();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در تعدیل");
		} finally {
			setAdjusting(false);
		}
	};

	const handleStatusChange = async (walletId: number, status: WalletStatus) => {
		try {
			await updateWalletStatus(walletId, status);
			toast.success("وضعیت کیف پول تغییر کرد");
			loadWallets();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در تغییر وضعیت");
		}
	};

	const openAdjustDialog = (
		wallet: AdminWallet,
		type: "INCREASE" | "DECREASE",
	) => {
		setSelectedWallet(wallet);
		setAdjustType(type);
		setAdjustAmount("");
		setAdjustReason("");
		setAdjustDialogOpen(true);
	};

	const getStatusColor = (status: WalletStatus) => {
		const colors: Record<WalletStatus, string> = {
			ACTIVE: "bg-green-100 text-green-800",
			SUSPENDED: "bg-yellow-100 text-yellow-800",
			CLOSED: "bg-red-100 text-red-800",
		};
		return colors[status] || "";
	};

	const getStatusLabel = (status: WalletStatus) => {
		const labels: Record<WalletStatus, string> = {
			ACTIVE: "فعال",
			SUSPENDED: "تعلیق",
			CLOSED: "بسته",
		};
		return labels[status];
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">مدیریت کیف پول‌ها</h1>
					<p className="text-muted-foreground">
						مدیریت و مشاهده کیف پول‌های سیستم
					</p>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 flex gap-2">
								<Input
									placeholder="شماره موبایل یا شناسه..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								/>
								<Button onClick={handleSearch} variant="secondary">
									<Search className="h-4 w-4" />
								</Button>
							</div>
							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="وضعیت" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه</SelectItem>
									<SelectItem value="ACTIVE">فعال</SelectItem>
									<SelectItem value="SUSPENDED">تعلیق</SelectItem>
									<SelectItem value="CLOSED">بسته</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={loadWallets}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Wallets Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							کیف پول‌ها ({total}) - صفحه {page} از {totalPages}
						</CardTitle>
					</CardHeader>
					<CardContent>
						{loading ? (
							<div className="flex items-center justify-center h-64">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						) : error ? (
							<div className="text-center py-8">
								<AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
								<p className="text-red-500">{error}</p>
							</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>شناسه</TableHead>
										<TableHead>کاربر</TableHead>
										<TableHead>موجودی</TableHead>
										<TableHead>ارز</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>نوع</TableHead>
										<TableHead>تاریخ</TableHead>
										<TableHead>عملیات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{wallets.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-8">
												کیف پولی یافت نشد
											</TableCell>
										</TableRow>
									) : (
										wallets.map((wallet) => (
											<TableRow key={wallet.id}>
												<TableCell className="font-mono text-xs">
													{wallet.publicId.slice(0, 8)}...
												</TableCell>
												<TableCell className="text-sm">
													{wallet.user?.phoneNumber || "-"}
													<span className="text-muted-foreground mr-2">
														(
														{wallet.user?.userType === "BUSINESS"
															? "کسب‌وکار"
															: "شخصی"}
														)
													</span>
												</TableCell>
												<TableCell className="font-mono font-bold">
													{formatCurrency(Number(wallet.balance))}
												</TableCell>
												<TableCell>{wallet.currency}</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded text-xs ${getStatusColor(
															wallet.status,
														)}`}
													>
														{getStatusLabel(wallet.status)}
													</span>
												</TableCell>
												<TableCell>
													{wallet.isPrimary ? (
														<span className="text-xs bg-primary/10 px-2 py-1 rounded">
															اصلی
														</span>
													) : (
														<span className="text-xs text-muted-foreground">
															فرعی
														</span>
													)}
												</TableCell>
												<TableCell className="text-sm">
													{formatDate(new Date(wallet.createdAt))}
												</TableCell>
												<TableCell>
													<div className="flex gap-1">
														<Button
															variant="ghost"
															size="sm"
															title="افزایش موجودی"
															onClick={() =>
																openAdjustDialog(wallet, "INCREASE")
															}
														>
															<Plus className="h-4 w-4 text-green-500" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															title="کاهش موجودی"
															onClick={() =>
																openAdjustDialog(wallet, "DECREASE")
															}
														>
															<Minus className="h-4 w-4 text-red-500" />
														</Button>
														{wallet.status === "ACTIVE" ? (
															<Button
																variant="ghost"
																size="sm"
																title="تعلیق"
																onClick={() =>
																	handleStatusChange(wallet.id, "SUSPENDED")
																}
															>
																<PauseCircle className="h-4 w-4 text-yellow-500" />
															</Button>
														) : wallet.status === "SUSPENDED" ? (
															<Button
																variant="ghost"
																size="sm"
																title="فعال کردن"
																onClick={() =>
																	handleStatusChange(wallet.id, "ACTIVE")
																}
															>
																<PlayCircle className="h-4 w-4 text-green-500" />
															</Button>
														) : null}
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2 mt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.max(1, p - 1))}
									disabled={page === 1}
								>
									قبلی
								</Button>
								<span className="text-sm">
									صفحه {page} از {totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
									disabled={page === totalPages}
								>
									بعدی
								</Button>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Adjust Balance Dialog */}
				<Dialog open={adjustDialogOpen} onOpenChange={setAdjustDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								{adjustType === "INCREASE" ? "افزایش" : "کاهش"} موجودی
							</DialogTitle>
							<DialogDescription>
								موجودی کیف پول را{" "}
								{adjustType === "INCREASE" ? "افزایش" : "کاهش"} دهید
							</DialogDescription>
						</DialogHeader>
						{selectedWallet && (
							<div className="space-y-4">
								<div className="bg-muted p-3 rounded-lg">
									<p className="text-sm">
										موجودی فعلی:{" "}
										{formatCurrency(Number(selectedWallet.balance))}
									</p>
									<p className="text-sm text-muted-foreground">
										کاربر: {selectedWallet.user?.phoneNumber}
									</p>
								</div>
								<div>
									<label className="text-sm font-medium">مبلغ</label>
									<Input
										type="number"
										value={adjustAmount}
										onChange={(e) => setAdjustAmount(e.target.value)}
										placeholder="مبلغ را وارد کنید"
									/>
								</div>
								<div>
									<label className="text-sm font-medium">دلیل</label>
									<Textarea
										value={adjustReason}
										onChange={(e) => setAdjustReason(e.target.value)}
										placeholder="دلیل تعدیل را وارد کنید..."
										rows={3}
									/>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setAdjustDialogOpen(false)}
							>
								انصراف
							</Button>
							<Button
								onClick={handleAdjust}
								disabled={adjusting || !adjustAmount || !adjustReason}
								variant={adjustType === "INCREASE" ? "default" : "destructive"}
							>
								{adjusting
									? "در حال پردازش..."
									: adjustType === "INCREASE"
										? "افزایش"
										: "کاهش"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AdminLayout>
	);
}
