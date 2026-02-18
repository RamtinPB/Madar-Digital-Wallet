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
	getAdminAdmins,
	createAdmin,
	updateAdmin,
	updateAdminStatus,
	deleteAdmin,
	type AdminAdminsParams,
	type CreateAdminParams,
} from "@/lib/api/admin";
import type { Admin, AdminType, AdminStatus } from "@/types/admin";
import { ADMIN_TYPE_LABELS, ADMIN_STATUS_LABELS } from "@/types/admin";
import { formatDate } from "@/lib/date";
import {
	RefreshCw,
	AlertCircle,
	UserPlus,
	MoreVertical,
	Edit,
	Trash2,
	PauseCircle,
	PlayCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminAdminsPage() {
	const [admins, setAdmins] = useState<Admin[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [adminType, setAdminType] = useState<string>("all");
	const [status, setStatus] = useState<string>("all");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);

	// Create/Edit dialog
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
	const [formData, setFormData] = useState<CreateAdminParams>({
		phoneNumber: "",
		password: "",
		adminType: "SUPPORT_ADMIN",
		department: "",
		permissions: [],
	});
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		loadAdmins();
	}, [page, adminType, status]);

	const loadAdmins = async () => {
		try {
			setLoading(true);
			const params: AdminAdminsParams = {
				page,
				limit: 20,
				adminType: adminType !== "all" ? (adminType as AdminType) : undefined,
				status: status !== "all" ? (status as AdminStatus) : undefined,
			};
			const response = await getAdminAdmins(params);
			setAdmins(response.admins);
			setTotalPages(response.totalPages);
			setTotal(response.total);
		} catch (err) {
			setError(err instanceof Error ? err.message : "خطا در دریافت اطلاعات");
		} finally {
			setLoading(false);
		}
	};

	const openCreateDialog = () => {
		setEditingAdmin(null);
		setFormData({
			phoneNumber: "",
			password: "",
			adminType: "SUPPORT_ADMIN",
			department: "",
			permissions: [],
		});
		setDialogOpen(true);
	};

	const openEditDialog = (admin: Admin) => {
		setEditingAdmin(admin);
		setFormData({
			phoneNumber: "", // Phone number is not editable
			password: "",
			adminType: admin.adminType,
			department: admin.department || "",
			permissions: admin.permissions,
		});
		setDialogOpen(true);
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			if (editingAdmin) {
				await updateAdmin(editingAdmin.id, {
					adminType: formData.adminType,
					department: formData.department || undefined,
					permissions: formData.permissions,
				});
				toast.success("مدیر با موفقیت ویرایش شد");
			} else {
				await createAdmin(formData);
				toast.success("مدیر با موفقیت ایجاد شد");
			}
			setDialogOpen(false);
			loadAdmins();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در ذخیره");
		} finally {
			setSaving(false);
		}
	};

	const handleStatusChange = async (
		adminId: number,
		newStatus: AdminStatus,
	) => {
		try {
			await updateAdminStatus(adminId, newStatus);
			toast.success("وضعیت مدیر تغییر کرد");
			loadAdmins();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در تغییر وضعیت");
		}
	};

	const handleDelete = async (adminId: number) => {
		if (!confirm("آیا از حذف این مدیر اطمینان دارید؟")) return;
		try {
			await deleteAdmin(adminId);
			toast.success("مدیر با موفقیت حذف شد");
			loadAdmins();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "خطا در حذف");
		}
	};

	const getStatusColor = (status: AdminStatus) => {
		const colors: Record<AdminStatus, string> = {
			ACTIVE: "bg-green-100 text-green-800",
			SUSPENDED: "bg-yellow-100 text-yellow-800",
			DEACTIVATED: "bg-red-100 text-red-800",
		};
		return colors[status] || "";
	};

	return (
		<AdminLayout>
			<div className="space-y-6">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-2xl font-bold">مدیریت مدیران</h1>
						<p className="text-muted-foreground">مدیریت و ایجاد مدیران سیستم</p>
					</div>
					<Button onClick={openCreateDialog}>
						<UserPlus className="h-4 w-4 ml-2" />
						افزودن مدیر
					</Button>
				</div>

				{/* Filters */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<Select value={adminType} onValueChange={setAdminType}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="نوع مدیر" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه</SelectItem>
									<SelectItem value="SUPER_ADMIN">مدیر ارشد</SelectItem>
									<SelectItem value="SUPPORT_ADMIN">پشتیبانی</SelectItem>
									<SelectItem value="FINANCE_ADMIN">مالی</SelectItem>
									<SelectItem value="RISK_ADMIN">ریسک</SelectItem>
									<SelectItem value="BUSINESS_ADMIN">کسب‌وکار</SelectItem>
								</SelectContent>
							</Select>
							<Select value={status} onValueChange={setStatus}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="وضعیت" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">همه</SelectItem>
									<SelectItem value="ACTIVE">فعال</SelectItem>
									<SelectItem value="SUSPENDED">تعلیق</SelectItem>
									<SelectItem value="DEACTIVATED">غیرفعال</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" onClick={loadAdmins}>
								<RefreshCw className="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Admins Table */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">
							مدیران ({total}) - صفحه {page} از {totalPages}
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
										<TableHead>دپارتمان</TableHead>
										<TableHead>دسترسی‌ها</TableHead>
										<TableHead>وضعیت</TableHead>
										<TableHead>آخرین ورود</TableHead>
										<TableHead>تاریخ ایجاد</TableHead>
										<TableHead>عملیات</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{admins.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8} className="text-center py-8">
												مدیری یافت نشد
											</TableCell>
										</TableRow>
									) : (
										admins.map((admin) => (
											<TableRow key={admin.id}>
												<TableCell className="font-mono text-xs">
													{admin.publicId.slice(0, 8)}...
												</TableCell>
												<TableCell>
													<span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
														{ADMIN_TYPE_LABELS[admin.adminType]}
													</span>
												</TableCell>
												<TableCell className="text-sm">
													{admin.department || "-"}
												</TableCell>
												<TableCell className="text-sm">
													<div className="flex flex-wrap gap-1">
														{admin.permissions.slice(0, 3).map((perm, i) => (
															<span
																key={i}
																className="px-1 py-0.5 bg-gray-100 rounded text-xs"
															>
																{perm}
															</span>
														))}
														{admin.permissions.length > 3 && (
															<span className="text-xs text-muted-foreground">
																+{admin.permissions.length - 3}
															</span>
														)}
													</div>
												</TableCell>
												<TableCell>
													<span
														className={`px-2 py-1 rounded text-xs ${getStatusColor(
															admin.status,
														)}`}
													>
														{ADMIN_STATUS_LABELS[admin.status]}
													</span>
												</TableCell>
												<TableCell className="text-sm">
													{admin.lastLoginAt
														? formatDate(new Date(admin.lastLoginAt))
														: "-"}
												</TableCell>
												<TableCell className="text-sm">
													{formatDate(new Date(admin.createdAt))}
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
																onClick={() => openEditDialog(admin)}
															>
																<Edit className="ml-2 h-4 w-4" />
																ویرایش
															</DropdownMenuItem>
															{admin.status === "ACTIVE" ? (
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(admin.id, "SUSPENDED")
																	}
																>
																	<PauseCircle className="ml-2 h-4 w-4" />
																	تعلیق
																</DropdownMenuItem>
															) : admin.status === "SUSPENDED" ? (
																<DropdownMenuItem
																	onClick={() =>
																		handleStatusChange(admin.id, "ACTIVE")
																	}
																>
																	<PlayCircle className="ml-2 h-4 w-4" />
																	فعال‌سازی
																</DropdownMenuItem>
															) : null}
															<DropdownMenuItem
																onClick={() => handleDelete(admin.id)}
																className="text-red-600 focus:text-red-600"
															>
																<Trash2 className="ml-2 h-4 w-4" />
																حذف
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

				{/* Create/Edit Dialog */}
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>
								{editingAdmin ? "ویرایش مدیر" : "افزودن مدیر جدید"}
							</DialogTitle>
							<DialogDescription>
								{editingAdmin
									? "اطلاعات مدیر را ویرایش کنید"
									: "یک مدیر جدید برای سیستم ایجاد کنید"}
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							{!editingAdmin && (
								<>
									<div>
										<label className="text-sm font-medium">شماره موبایل</label>
										<Input
											value={formData.phoneNumber}
											onChange={(e) =>
												setFormData({
													...formData,
													phoneNumber: e.target.value,
												})
											}
											placeholder="شماره موبایل را وارد کنید"
										/>
									</div>
									<div>
										<label className="text-sm font-medium">رمز عبور</label>
										<Input
											type="password"
											value={formData.password}
											onChange={(e) =>
												setFormData({ ...formData, password: e.target.value })
											}
											placeholder="رمز عبور را وارد کنید"
										/>
									</div>
								</>
							)}
							<div>
								<label className="text-sm font-medium">نوع مدیر</label>
								<Select
									value={formData.adminType}
									onValueChange={(value) =>
										setFormData({ ...formData, adminType: value as AdminType })
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="SUPER_ADMIN">مدیر ارشد</SelectItem>
										<SelectItem value="SUPPORT_ADMIN">پشتیبانی</SelectItem>
										<SelectItem value="FINANCE_ADMIN">مالی</SelectItem>
										<SelectItem value="RISK_ADMIN">ریسک</SelectItem>
										<SelectItem value="BUSINESS_ADMIN">کسب‌وکار</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="text-sm font-medium">دپارتمان</label>
								<Input
									value={formData.department}
									onChange={(e) =>
										setFormData({ ...formData, department: e.target.value })
									}
									placeholder="دپارتمان (اختیاری)"
								/>
							</div>
							{editingAdmin && (
								<div>
									<label className="text-sm font-medium">
										رمز عبور جدید (اختیاری)
									</label>
									<Input
										type="password"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="خالی رها کنید برای عدم تغییر"
									/>
								</div>
							)}
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								انصراف
							</Button>
							<Button
								onClick={handleSave}
								disabled={
									saving ||
									(!editingAdmin &&
										(!formData.phoneNumber || !formData.password))
								}
							>
								{saving ? "در حال ذخیره..." : "ذخیره"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</AdminLayout>
	);
}
