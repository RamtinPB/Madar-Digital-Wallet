"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarProvider,
	SidebarInset,
	SidebarTrigger,
	SidebarGroup,
	SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthUser, useLogout } from "@/hooks/useAuth";
import { useAdmin, useAdminNavItems } from "@/hooks/useAdmin";
import {
	LayoutDashboard,
	Users,
	ArrowLeftRight,
	Wallet,
	FileText,
	Shield,
	ChevronLeft,
	User,
	Settings,
	LogOut,
	ChevronDown,
	Home,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
	LayoutDashboard,
	Users,
	ArrowLeftRight,
	Wallet,
	FileText,
	Shield,
};

interface AdminLayoutProps {
	children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
	const router = useRouter();
	const currentPath = router.pathname;
	const user = useAuthUser();
	const logout = useLogout();
	const { isAdmin, adminInfo, adminType, isLoading } = useAdmin();
	const navItems = useAdminNavItems();

	// Redirect if not admin
	useEffect(() => {
		if (!isLoading && !isAdmin) {
			router.push("/");
		}
	}, [isAdmin, isLoading, router]);

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	const handleBackToApp = () => {
		router.push("/");
	};

	// Check if a nav item should be active based on current path
	const isPathActive = (href: string) => {
		if (href === "/admin") {
			return currentPath === "/admin";
		}
		return currentPath.startsWith(href);
	};

	// Get admin type label
	const getAdminTypeLabel = (type: string | null) => {
		const labels: Record<string, string> = {
			SUPER_ADMIN: "مدیر ارشد",
			SUPPORT_ADMIN: "پشتیبانی",
			FINANCE_ADMIN: "مالی",
			RISK_ADMIN: "ریسک",
			BUSINESS_ADMIN: "کسب‌وکار",
		};
		return labels[type || ""] || type || "";
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
			</div>
		);
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<SidebarProvider defaultOpen={true} dir="rtl">
			<Sidebar side="right" className="border-l">
				<SidebarHeader className="p-4">
					<div className="flex items-center gap-2">
						<Shield className="h-6 w-6 text-primary" />
						<h2 className="text-lg font-bold">پنل مدیریت</h2>
					</div>
					<p className="text-xs text-muted-foreground mt-1">
						{getAdminTypeLabel(adminType)}
					</p>
				</SidebarHeader>

				<SidebarContent className="overflow-y-auto [&::-webkit-scrollbar]:w-2">
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu className="flex flex-col gap-1">
								{/* Back to App */}
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										className="hover:bg-accent"
										onClick={handleBackToApp}
									>
										<button className="w-full flex justify-start items-center gap-2">
											<Home className="w-4 h-4" />
											<p className="">بازگشت به اپ</p>
										</button>
									</SidebarMenuButton>
								</SidebarMenuItem>

								{/* Navigation Items */}
								{navItems.map((item) => {
									const Icon = iconMap[item.icon] || LayoutDashboard;
									return (
										<SidebarMenuItem key={item.key}>
											<SidebarMenuButton
												asChild
												isActive={isPathActive(item.href)}
												className={`${
													isPathActive(item.href) ? "bg-sidebar-accent!" : ""
												}`}
											>
												<Link
													href={item.href}
													className="flex justify-start items-center gap-2"
												>
													<Icon className="w-4 h-4" />
													<p className="">{item.name}</p>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					{/* User profile dropdown */}
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<button className="flex w-full items-center gap-3 rounded-md p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
								<Avatar className="h-8 w-8">
									<AvatarFallback className="bg-primary text-primary-foreground text-xs">
										{user?.phoneNumber ? user.phoneNumber.slice(-2) : "؟"}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start text-sm">
									<span className="font-medium">
										{user?.phoneNumber || "مدیر"}
									</span>
									<span className="text-xs text-muted-foreground">
										{getAdminTypeLabel(adminType)}
									</span>
								</div>
								<ChevronDown className="mr-auto h-4 w-4 text-muted-foreground" />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>حساب مدیریت</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User className="ml-2 h-4 w-4" />
								<span>پروفایل</span>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="ml-2 h-4 w-4" />
								<span>تنظیمات</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleBackToApp}>
								<Home className="ml-2 h-4 w-4" />
								<span>بازگشت به اپ</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleLogout}
								className="text-red-600 focus:text-red-600 focus:bg-red-50"
							>
								<LogOut className="ml-2 h-4 w-4" />
								<span>خروج</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarFooter>
			</Sidebar>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<div className="mr-auto">
						<span className="text-sm text-muted-foreground">
							پنل مدیریت {adminInfo?.department && `| ${adminInfo.department}`}
						</span>
					</div>
				</header>
				<div className="p-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
