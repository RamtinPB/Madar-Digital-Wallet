"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getAdminAuditLogs, type AdminAuditLogsParams } from "@/lib/api/admin";
import type { AdminAuditLog } from "@/types/admin";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import {
	RefreshCw,
	AlertCircle,
	User,
	ArrowLeftRight,
	Wallet,
	Shield,
} from "lucide-react";

// Icon mapping for entity types
const getEntityIcon = (entityType: string) => {
	const icons: Record<string, React.ComponentType<any>> = {
		User,
		Transaction: ArrowLeftRight,
		Wallet,
		Admin: Shield,
	};
	return icons[entityType] || User;
};

// Action labels
const getActionLabel = (action: string) => {
	const labels: Record<string, string> = {
		USER_CREATED: "ایجاد کاربر",
		USER_UPDATED: "ویرایش کاربر",
		USER_SUSPENDED: "تعلیق کاربر",
		USER_REACTIVATED: "فعال‌سازی کاربر",
		TRANSACTION_CREATED: "ایجاد تراکنش",
		TRANSACTION_REFUNDED: "استرداد تراکنش",
		TRANSACTION_CANCELLED: "لغو تراکنش",
		TRANSACTION_COMPLETED: "تکمیل تراکنش",
		WALLET_CREATED: "ایجاد کیف پول",
		WALLET_ADJUSTED: "تعدیل موجودی",
		WALLET_SUSPENDED: "تعلیق کیف پول",
		WALLET_REACTIVATED: "فعال‌سازی کیف پول",
		ADMIN_CREATED: "ایجاد مدیر",
		ADMIN_UPDATED: "ویرایش مدیر",
		ADMIN_SUSPENDED: "تعلیق مدیر",
		ADMIN_DELETED: "حذف مدیر",
		LOGIN: "ورود",
		LOGOUT: "خروج",
	};
	return labels[action] || action;
};

export default function AdminAuditPage() {
	const [logs, setLogs] = useState<AdminAuditLog[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [action, setAction] = useState<string>("all");
	const [entityType, setEntityType] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		loadLogs();
	}, [page, action, entityType]);

	const loadLogs = async () => {
		try {
			setLoading(true);
			const params: AdminAuditLogsParams = {
				page,
				limit: 20,
				action: action !== "all" ? action : undefined,
				entityType: entityType !== "all" ? entityType : undefined,
			};
			const response = await getAdminAuditLogs(params);
			setLogs(response.logs);
			setTotalPages(response.totalPages);
			setTotal(response.total);
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">گزارشات و لاگ‌ها</h1>
					<p className="text-muted-foreground">
						مشاهده تاریخچه فعالیت‌های مدیران
					</p>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<Select value={action} onValueChange={setAction}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="نوع عملیات" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه عملیات‌ها</SelectItem>
									<SelectItem value="USER_CREATED">ایجاد کاربر</SelectItem>
									<SelectItem value="USER_UPDATED">ویرایش کاربر</SelectItem>
									<SelectItem value="USER_SUSPENDED">تعلیق کاربر</SelectItem>
									<SelectItem value="USER_REACTIVATED">
										فعال‌سازی کاربر
									</SelectItem>
									<SelectItem value="TRANSACTION_CREATED">
										ایجاد تراکنش
									</SelectItem>
									<SelectItem value="TRANSACTION_REFUNDED">
										استرداد تراکنش
									</SelectItem>
									<SelectItem value="TRANSACTION_CANCELLED">
										لغو تراکنش
									</SelectItem>
									<SelectItem value="WALLET_CREATED">ایجاد کیف پول</SelectItem>
									<SelectItem value="WALLET_ADJUSTED">تعدیل موجودی</SelectItem>
									<SelectItem value="WALLET_SUSPENDED">
										تعلیق کیف پول
									</SelectItem>
									<SelectItem value="WALLET_REACTIVATED">
										فعال‌سازی کیف پول
									</SelectItem>
									<SelectItem value="ADMIN_CREATED">ایجاد مدیر</SelectItem>
									<SelectItem value="ADMIN_UPDATED">ویرایش مدیر</SelectItem>
									<SelectItem value="LOGIN">ورود</SelectItem>
									<SelectItem value="LOGOUT">خروج</SelectItem>
								</SelectContent>
							</Select>
							<Select value={entityType} onValueChange={setEntityType}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="نوع موجودیت" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه موجودیت‌ها</SelectItem>
									<SelectItem value="User">کاربر</SelectItem>
									<SelectItem value="Transaction">تراکنش</SelectItem>
									<SelectItem value="Wallet">کیف پول</SelectItem>
									<SelectItem value="Admin">مدیر</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={loadLogs}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Audit Logs Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							لاگ‌ها ({total}) - صفحه {page} از {totalPages}
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
										<TableHead>تاریخ</TableHead>
										<TableHead>مدیر</TableHead>
										<TableHead>عملیات</TableHead>
										<TableHead>موجودیت</TableHead>
										<TableHead>شناسه</TableHead>
										<TableHead>توضیحات</TableHead>
										<TableHead>IP</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{logs.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7} className="text-center py-8">
												لاگی یافت نشد
											</TableCell>
										</TableRow>
									) : (
										logs.map((log) => {
											const EntityIcon = getEntityIcon(log.entityType);
											return (
												<TableRow key={log.id}>
													<TableCell className="text-sm whitespace-nowrap">
														{formatDate(new Date(log.createdAt))}
													</TableCell>
													<TableCell className="text-sm">
														<div className="flex items-center gap-2">
															<User className="h-4 w-4 text-muted-foreground" />
															{log.admin?.user?.phoneNumber || log.adminId}
														</div>
														<span className="text-xs text-muted-foreground">
															({log.admin?.adminType})
														</span>
													</TableCell>
													<TableCell>
														<span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
															{getActionLabel(log.action)}
														</span>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<EntityIcon className="h-4 w-4 text-muted-foreground" />
															{log.entityType}
														</div>
													</TableCell>
													<TableCell className="font-mono text-xs">
														{log.entityId}
													</TableCell>
													<TableCell className="text-sm max-w-xs truncate">
														{log.description || "-"}
													</TableCell>
													<TableCell className="text-xs font-mono text-muted-foreground">
														{log.ipAddress || "-"}
													</TableCell>
												</TableRow>
											);
										})
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
			</div>
		</AdminLayout>
	);
}
