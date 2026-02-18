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
import {
	getAdminUsers,
	updateUserStatus,
	type AdminUsersParams,
} from "@/lib/api/admin";
import type { AdminUser } from "@/types/admin";
import { USER_TYPE_LABELS } from "@/types/admin";
import { formatDate } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import {
	Search,
	RefreshCw,
	UserPlus,
	MoreVertical,
	AlertCircle,
	CheckCircle,
	PauseCircle,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [userType, setUserType] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		loadUsers();
	}, [page, userType]);

	const loadUsers = async () => {
		try {
			setLoading(true);
			const params: AdminUsersParams = {
				page,
				limit: 20,
				search: search || undefined,
				userType:
					userType !== "all"
						? (userType as "CUSTOMER" | "BUSINESS")
						: undefined,
			};
			const response = await getAdminUsers(params);
			setUsers(response.users);
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
		loadUsers();
	};

	const handleStatusChange = async (
		userId: number,
		status: "ACTIVE" | "SUSPENDED",
	) => {
		try {
			await updateUserStatus(userId, status);
			toast.success(`وضعیت کاربر با موفقیت تغییر کرد`);
			loadUsers();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در تغییر وضعیت");
		}
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">مدیریت کاربران</h1>
					<p className="text-muted-foreground">مدیریت و مشاهده کاربران سیستم</p>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 flex gap-2">
								<Input
									placeholder="شماره موبایل..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleSearch()}
								/>
								<Button onClick={handleSearch} variant="secondary">
									<Search className="h-4 w-4" />
								</Button>
							</div>
							<Select value={userType} onValueChange={setUserType}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="نوع کاربر" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه</SelectItem>
									<SelectItem value="CUSTOMER">شخصی</SelectItem>
									<SelectItem value="BUSINESS">کسب‌وکار</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={loadUsers}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Users Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							کاربران ({total}) - صفحه {page} از {totalPages}
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
										<TableHead>شماره موبایل</TableHead>
										<TableHead>نوع</TableHead>
										<TableHead>تاریخ ثبت‌نام</TableHead>
										<TableHead>کیف پول‌ها</TableHead>
										<TableHead>عملیات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{users.length === 0 ? (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-8">
												کاربری یافت نشد
											</TableCell>
										</TableRow>
									) : (
										users.map((user) => (
											<TableRow key={user.id}>
												<TableCell className="font-mono">
													{user.phoneNumber}
												</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded text-xs ${
															user.userType === "BUSINESS"
																? "bg-blue-100 text-blue-800"
																: "bg-green-100 text-green-800"
														}`}
													>
														{USER_TYPE_LABELS[user.userType]}
													</span>
												</TableCell>
												<TableCell>
													{formatDate(new Date(user.createdAt))}
												</TableCell>
												<TableCell>
													{user.wallets?.length || 0} کیف پول
													{user.wallets && user.wallets.length > 0 && (
														<span className="text-muted-foreground mr-2">
															(موجودی:{" "}
															{formatCurrency(
																user.wallets.reduce(
																	(sum, w) => sum + Number(w.balance),
																	0,
																),
															)}
															)
														</span>
													)}
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" size="sm">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(user.id, "SUSPENDED")
																}
															>
																<PauseCircle className="ml-2 h-4 w-4" />
																تعلیق
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleStatusChange(user.id, "ACTIVE")
																}
															>
																<CheckCircle className="ml-2 h-4 w-4" />
																فعال کردن
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
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
			</div>
		</AdminLayout>
	);
}
