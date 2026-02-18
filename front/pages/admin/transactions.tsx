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
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	getAdminTransactions,
	refundTransaction,
	cancelTransaction,
	type AdminTransactionsParams,
} from "@/lib/api/admin";
import type { AdminTransaction, TransactionStatus } from "@/types/admin";
import {
	TRANSACTION_STATUS_LABELS,
	TRANSACTION_TYPE_LABELS,
} from "@/types/admin";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import {
	Search,
	RefreshCw,
	AlertCircle,
	RotateCcw,
	XCircle,
	Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminTransactionsPage() {
	const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string>("all");
	const [transactionType, setTransactionType] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	// Refund dialog
	const [refundDialogOpen, setRefundDialogOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] =
		useState<AdminTransaction | null>(null);
	const [refundReason, setRefundReason] = useState("");
	const [refundAmount, setRefundAmount] = useState("");
	const [refunding, setRefunding] = useState(false);

	// Cancel dialog
	const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [cancelling, setCancelling] = useState(false);

	useEffect(() => {
		loadTransactions();
	}, [page, status, transactionType]);

	const loadTransactions = async () => {
		try {
			setLoading(true);
			const params: AdminTransactionsParams = {
				page,
				limit: 20,
				search: search || undefined,
				status: status !== "all" ? (status as TransactionStatus) : undefined,
				transactionType:
					transactionType !== "all" ? transactionType : undefined,
			};
			const response = await getAdminTransactions(params);
			setTransactions(response.transactions);
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
		loadTransactions();
	};

	const handleRefund = async () => {
		if (!selectedTransaction) return;
		try {
			setRefunding(true);
			await refundTransaction(
				selectedTransaction.id,
				refundReason,
				refundAmount ? parseFloat(refundAmount) : undefined,
			);
			toast.success("تراکنش با موفقیت استرداد شد");
			setRefundDialogOpen(false);
			setRefundReason("");
			setRefundAmount("");
			setSelectedTransaction(null);
			loadTransactions();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در استرداد");
		} finally {
			setRefunding(false);
		}
	};

	const handleCancel = async () => {
		if (!selectedTransaction) return;
		try {
			setCancelling(true);
			await cancelTransaction(selectedTransaction.id, cancelReason);
			toast.success("تراکنش با موفقیت لغو شد");
			setCancelDialogOpen(false);
			setCancelReason("");
			setSelectedTransaction(null);
			loadTransactions();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در لغو");
		} finally {
			setCancelling(false);
		}
	};

	const openRefundDialog = (tx: AdminTransaction) => {
		setSelectedTransaction(tx);
		setRefundReason("");
		setRefundAmount("");
		setRefundDialogOpen(true);
	};

	const openCancelDialog = (tx: AdminTransaction) => {
		setSelectedTransaction(tx);
		setCancelReason("");
		setCancelDialogOpen(true);
	};

	const getStatusColor = (status: TransactionStatus) => {
		const colors: Record<TransactionStatus, string> = {
			PENDING: "bg-yellow-100 text-yellow-800",
			PROCESSING: "bg-blue-100 text-blue-800",
			COMPLETED: "bg-green-100 text-green-800",
			FAILED: "bg-red-100 text-red-800",
			REFUNDED: "bg-purple-100 text-purple-800",
		};
		return colors[status] || "";
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">مدیریت تراکنش‌ها</h1>
					<p className="text-muted-foreground">
						مدیریت و مشاهده تراکنش‌های سیستم
					</p>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 flex gap-2">
								<Input
									placeholder="جستجو..."
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
									<SelectItem value="PENDING">در انتظار</SelectItem>
									<SelectItem value="PROCESSING">در حال پردازش</SelectItem>
									<SelectItem value="COMPLETED">تکمیل شده</SelectItem>
									<SelectItem value="FAILED">ناموفق</SelectItem>
									<SelectItem value="REFUNDED">استرداد شده</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={transactionType}
								onValueChange={setTransactionType}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="نوع تراکنش" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه</SelectItem>
									<SelectItem value="DEPOSIT">واریز</SelectItem>
									<SelectItem value="WITHDRAW">برداشت</SelectItem>
									<SelectItem value="TRANSFER">انتقال</SelectItem>
									<SelectItem value="PURCHASE">خرید</SelectItem>
									<SelectItem value="REFUND">استرداد</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={loadTransactions}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Transactions Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							تراکنش‌ها ({total}) - صفحه {page} از {totalPages}
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
										<TableHead>نوع</TableHead>
										<TableHead>مبلغ</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>فرستنده</TableHead>
										<TableHead>گیرنده</TableHead>
										<TableHead>تاریخ</TableHead>
										<TableHead>عملیات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{transactions.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-8">
												تراکنشی یافت نشد
											</TableCell>
										</TableRow>
									) : (
										transactions.map((tx) => (
											<TableRow key={tx.id}>
												<TableCell className="font-mono text-xs">
													{tx.publicId.slice(0, 8)}...
												</TableCell>
												<TableCell>
													<span className="px-2 py-1 rounded text-xs bg-gray-100">
														{TRANSACTION_TYPE_LABELS[tx.transactionType]}
													</span>
												</TableCell>
												<TableCell className="font-mono">
													{formatCurrency(Number(tx.amount))}
												</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded text-xs ${getStatusColor(
															tx.status,
														)}`}
													>
														{TRANSACTION_STATUS_LABELS[tx.status]}
													</span>
												</TableCell>
												<TableCell className="text-sm">
													{tx.payerWallet?.user?.phoneNumber || "-"}
												</TableCell>
												<TableCell className="text-sm">
													{tx.receiverWallet?.user?.phoneNumber || "-"}
												</TableCell>
												<TableCell className="text-sm">
													{formatDate(new Date(tx.createdAt))}
												</TableCell>
												<TableCell>
													<div className="flex gap-1">
														{tx.status === "COMPLETED" && (
															<>
																<Button
																	variant="ghost"
																	size="sm"
																	title="استرداد"
																	onClick={() => openRefundDialog(tx)}
																>
																	<RotateCcw className="h-4 w-4" />
																</Button>
															</>
														)}
														{tx.status === "PENDING" && (
															<Button
																variant="ghost"
																size="sm"
																title="لغو"
																onClick={() => openCancelDialog(tx)}
															>
																<XCircle className="h-4 w-4" />
															</Button>
														)}
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

				{/* Refund Dialog */}
				<Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>استرداد تراکنش</DialogTitle>
							<DialogDescription>
								آیا از استرداد این تراکنش اطمینان دارید؟
							</DialogDescription>
						</DialogHeader>
						{selectedTransaction && (
							<div className="space-y-4">
								<div className="bg-muted p-3 rounded-lg">
									<p className="text-sm">
										مبلغ: {formatCurrency(Number(selectedTransaction.amount))}
									</p>
									<p className="text-sm text-muted-foreground">
										شناسه: {selectedTransaction.publicId.slice(0, 8)}...
									</p>
								</div>
								<div>
									<label className="text-sm font-medium">
										مبلغ استرداد (اختیاری)
									</label>
									<Input
										type="number"
										value={refundAmount}
										onChange={(e) => setRefundAmount(e.target.value)}
										placeholder={String(selectedTransaction.amount)}
									/>
								</div>
								<div>
									<label className="text-sm font-medium">دلیل استرداد</label>
									<Textarea
										value={refundReason}
										onChange={(e) => setRefundReason(e.target.value)}
										placeholder="دلیل استرداد را وارد کنید..."
										rows={3}
									/>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setRefundDialogOpen(false)}
							>
								انصراف
							</Button>
							<Button
								onClick={handleRefund}
								disabled={refunding || !refundReason}
							>
								{refunding ? "در حال استرداد..." : "استرداد"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				{/* Cancel Dialog */}
				<Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>لغو تراکنش</DialogTitle>
							<DialogDescription>
								آیا از لغو این تراکنش اطمینان دارید؟
							</DialogDescription>
						</DialogHeader>
						{selectedTransaction && (
							<div className="space-y-4">
								<div className="bg-muted p-3 rounded-lg">
									<p className="text-sm">
										مبلغ: {formatCurrency(Number(selectedTransaction.amount))}
									</p>
									<p className="text-sm text-muted-foreground">
										شناسه: {selectedTransaction.publicId.slice(0, 8)}...
									</p>
								</div>
								<div>
									<label className="text-sm font-medium">دلیل لغو</label>
									<Textarea
										value={cancelReason}
										onChange={(e) => setCancelReason(e.target.value)}
										placeholder="دلیل لغو را وارد کنید..."
										rows={3}
									/>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setCancelDialogOpen(false)}
							>
								انصراف
							</Button>
							<Button
								onClick={handleCancel}
								disabled={cancelling || !cancelReason}
							>
								{cancelling ? "در حال لغو..." : "لغو"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AdminLayout>
	);
}
