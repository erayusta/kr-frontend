import {
	BookOpen,
	Calendar,
	Hash,
	Heart,
	LogOut,
	Mail,
	Phone,
	Settings,
	Tag,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CampaignCard from "@/components/common/CampaignCard";
import { Layout } from "@/components/layouts/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { clearFavorites, setFavorited } from "@/lib/favorites";
import { fetchFavoritesDetails } from "@/lib/favoritesApi";

type Profile = {
	id: number;
	name: string;
	email: string;
	phone?: string | null;
	birth_date?: string | null;
	gender?: string | null;
	role?: string;
	is_active?: boolean;
	created_at?: string;
	updated_at?: string;
};

type FavoriteCampaign = {
	id: number;
	title: string;
	slug: string;
	image: string;
	start_date: string;
	end_date: string;
	brands: Array<{ id: number; name: string; slug: string; logo: string }>;
	categories: Array<{ id: number; name: string; slug: string }>;
};

type FavoritePost = {
	id: number;
	title: string;
	slug: string;
	image: string;
	excerpt: string;
	created_at: string;
};

function initialsFromName(name?: string) {
	const parts = (name || "").trim().split(/\s+/).filter(Boolean);
	const a = parts[0]?.[0] ?? "";
	const b = parts[1]?.[0] ?? "";
	const text = `${a}${b}`.toUpperCase();
	return text.length ? text : "KR";
}

function formatDate(iso?: string | null) {
	if (!iso) return "-";
	const dt = new Date(iso);
	if (Number.isNaN(dt.getTime())) return "-";
	return new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(dt);
}

function StatCard({
	label,
	value,
	icon,
	active,
	onClick,
}: {
	label: string;
	value: number;
	icon: React.ReactNode;
	active?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-2 rounded-lg border p-2 sm:p-2.5 transition-all w-full text-left ${
				active
					? "bg-orange-50 border-orange-300 shadow-sm"
					: "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300"
			}`}
		>
			<div className={`rounded-md p-1.5 shrink-0 ${active ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-[10px] sm:text-xs text-gray-500 truncate">{label}</p>
				<p className="text-sm sm:text-base font-semibold leading-5">{value}</p>
			</div>
		</button>
	);
}

export default function ProfilePage() {
	const router = useRouter();
	const { profile: rawProfile, isLoggedIn, loading, logout } = useAuth();
	const profile = rawProfile as Profile | null;

	const [favoritesData, setFavoritesData] = useState<{
		campaigns: FavoriteCampaign[];
		posts: FavoritePost[];
	}>({ campaigns: [], posts: [] });
	const [counts, setCounts] = useState({ campaign: 0, post: 0 });
	const [favoritesLoading, setFavoritesLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"campaigns" | "posts">("campaigns");

	useEffect(() => {
		if (isLoggedIn) {
			loadFavorites();
		}
	}, [isLoggedIn]);

	const loadFavorites = async () => {
		try {
			setFavoritesLoading(true);
			const result = await fetchFavoritesDetails();
			setFavoritesData({
				campaigns: result.data.campaigns || [],
				posts: result.data.posts || [],
			});
			setCounts({
				campaign: result.counts.campaign || 0,
				post: result.counts.post || 0,
			});
		} catch (error) {
			console.error("Failed to load favorites:", error);
		} finally {
			setFavoritesLoading(false);
		}
	};

	const handleRemoveFavorite = async (type: string, id: string | number) => {
		setFavorited(type, String(id), false);
		// Reload favorites
		await loadFavorites();
	};

	const handleClearAll = async () => {
		clearFavorites();
		setFavoritesData({ campaigns: [], posts: [] });
		setCounts({ campaign: 0, post: 0 });
	};

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	const totalFavorites = counts.campaign + counts.post;

	if (!isLoggedIn && !loading) {
		return (
			<Layout>
				<div className="container py-10 sm:py-20 text-center">
					<div className="mx-auto max-w-md rounded-xl sm:rounded-2xl border bg-white p-6 sm:p-10 shadow-sm">
						<User className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-3 sm:mb-4" />
						<h1 className="text-xl sm:text-2xl font-semibold mb-1.5 sm:mb-2">Giriş Yapmanız Gerekiyor</h1>
						<p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
							Profil sayfasını görüntülemek için lütfen giriş yapın.
						</p>
						<Button asChild size="lg" className="w-full sm:w-auto">
							<Link href="/giris">Giriş Yap</Link>
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container py-6 md:py-10">
				<div className="space-y-6">
					{/* Profile Header */}
					<Card className="relative overflow-hidden border-0 shadow-lg rounded-xl sm:rounded-2xl">
						<div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400" />

						<CardContent className="relative p-4 sm:p-5 md:p-6">
							<div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-3 sm:gap-4">
									<Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-white/40 bg-white shadow-lg shrink-0">
										<AvatarFallback className="text-lg sm:text-xl font-bold text-orange-600 bg-white">
											{initialsFromName(profile?.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0 flex-1">
										{loading ? (
											<div className="space-y-1.5">
												<Skeleton className="h-5 sm:h-6 w-36 sm:w-44 bg-black/10" />
												<Skeleton className="h-3.5 sm:h-4 w-44 sm:w-56 bg-black/10" />
											</div>
										) : (
											<>
												<h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
													{profile?.name || "Kullanıcı"}
												</h1>
												<p className="text-gray-700 mt-0.5 text-xs sm:text-sm truncate">
													{profile?.email}
												</p>
											</>
										)}
									</div>
								</div>

								<Button
									onClick={handleLogout}
									size="sm"
									className="gap-1.5 bg-orange-600 hover:bg-orange-700 text-white border-0 w-full sm:w-auto text-xs sm:text-sm"
								>
									<LogOut className="h-3.5 w-3.5" />
									Çıkış Yap
								</Button>
							</div>

							{/* Quick Stats */}
							<div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2">
								<div className="rounded-lg bg-white/40 backdrop-blur-sm p-2.5 sm:p-3 text-center">
									<p className="text-[10px] sm:text-xs text-gray-700">Kampanya</p>
									<p className="text-lg sm:text-xl font-bold text-gray-900">{counts.campaign}</p>
								</div>
								<div className="rounded-lg bg-white/40 backdrop-blur-sm p-2.5 sm:p-3 text-center">
									<p className="text-[10px] sm:text-xs text-gray-700">Blog</p>
									<p className="text-lg sm:text-xl font-bold text-gray-900">{counts.post}</p>
								</div>
								<div className="rounded-lg bg-white/40 backdrop-blur-sm p-2.5 sm:p-3 text-center">
									<p className="text-[10px] sm:text-xs text-gray-700">Üyelik</p>
									<p className="text-xs sm:text-sm font-semibold text-gray-900">{formatDate(profile?.created_at)}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Favorites Section */}
					<Tabs defaultValue="favorites" className="space-y-4 sm:space-y-6">
						<div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
							<TabsList className="w-full sm:w-fit grid grid-cols-2 sm:flex gap-3 rounded-xl border-0 bg-orange-500 p-2 shadow-md">
								<TabsTrigger
									value="favorites"
									className="gap-1.5 sm:gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-white/80 data-[state=inactive]:hover:bg-orange-400 data-[state=inactive]:hover:text-white"
								>
									<Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									Favorilerim
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="gap-1.5 sm:gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:text-white/80 data-[state=inactive]:hover:bg-orange-400 data-[state=inactive]:hover:text-white"
								>
									<Settings className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									Hesap Bilgileri
								</TabsTrigger>
							</TabsList>

							<Button
								variant="outline"
								onClick={handleClearAll}
								className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm w-full sm:w-auto"
								disabled={totalFavorites === 0}
							>
								<Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								Tüm favorileri temizle
							</Button>
						</div>

						<TabsContent value="favorites" className="mt-0">
							{/* Category Tabs */}
							<div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
								<StatCard
									label="Kampanyalar"
									value={counts.campaign}
									icon={<Tag className="h-4 w-4" />}
									active={activeTab === "campaigns"}
									onClick={() => setActiveTab("campaigns")}
								/>
								<StatCard
									label="Blog Yazıları"
									value={counts.post}
									icon={<BookOpen className="h-4 w-4" />}
									active={activeTab === "posts"}
									onClick={() => setActiveTab("posts")}
								/>
							</div>

							{/* Campaigns */}
							{activeTab === "campaigns" && (
								<div>
									{favoritesLoading ? (
										<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-48 sm:h-56 w-full rounded-lg" />
											))}
										</div>
									) : favoritesData.campaigns.length === 0 ? (
										<EmptyState
											icon={<Tag className="h-8 w-8 sm:h-10 sm:w-10" />}
											title="Favori kampanya yok"
											description="Henüz bir kampanyayı favorilerine eklemedin."
											action={{ href: "/", label: "Kampanyaları Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
											{favoritesData.campaigns.map((campaign) => (
												<div key={campaign.id}>
													<CampaignCard
														id={campaign.id}
														title={campaign.title}
														slug={campaign.slug}
														image={campaign.image}
														brands={campaign.brands}
														end_date={campaign.end_date}
													/>
												</div>
											))}
										</div>
									)}
								</div>
							)}

							{/* Posts */}
							{activeTab === "posts" && (
								<div>
									{favoritesLoading ? (
										<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-36 sm:h-44 w-full rounded-lg" />
											))}
										</div>
									) : favoritesData.posts.length === 0 ? (
										<EmptyState
											icon={<BookOpen className="h-8 w-8 sm:h-10 sm:w-10" />}
											title="Favori blog yazısı yok"
											description="Henüz bir blog yazısını favorilerine eklemedin."
											action={{ href: "/blog", label: "Blog Yazılarını Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
											{favoritesData.posts.map((post) => (
												<Link key={post.id} href={`/blog/${post.slug}`} className="group">
													<Card className="overflow-hidden hover:shadow-md transition-all h-full border-gray-200">
														{post.image && (
															<div className="aspect-[16/10] overflow-hidden">
																<img
																	src={post.image}
																	alt={post.title}
																	className="w-full h-full object-cover group-hover:scale-105 transition-transform"
																/>
															</div>
														)}
														<CardContent className="p-2 sm:p-3">
															<p className="font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-xs sm:text-sm leading-tight">
																{post.title}
															</p>
															<p className="text-[10px] sm:text-xs text-gray-500 mt-1">
																{post.created_at}
															</p>
														</CardContent>
													</Card>
												</Link>
											))}
										</div>
									)}
								</div>
							)}
						</TabsContent>

						<TabsContent value="settings" className="mt-0">
							<div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
								<Card>
									<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
										<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
											<User className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
											Hesap Bilgileri
										</CardTitle>
									</CardHeader>

									<CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
										<div className="grid gap-2 sm:gap-3">
											<InfoRow icon={<Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label="Kullanıcı ID" value={profile?.id ?? "-"} />
											<InfoRow icon={<Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label="E-posta" value={profile?.email || "-"} />
											<InfoRow icon={<Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label="Telefon" value={profile?.phone || "-"} />
											<InfoRow icon={<Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />} label="Üyelik Tarihi" value={formatDate(profile?.created_at)} />
										</div>

										<div className="grid grid-cols-2 gap-2 sm:gap-3">
											<div className="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/60 px-3 sm:px-4 py-2.5 sm:py-3">
												<p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Cinsiyet</p>
												<p className="text-xs sm:text-sm font-semibold text-gray-800">{profile?.gender || "-"}</p>
											</div>
											<div className="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/60 px-3 sm:px-4 py-2.5 sm:py-3">
												<p className="text-[10px] sm:text-xs text-gray-500 mb-0.5">Doğum Tarihi</p>
												<p className="text-xs sm:text-sm font-semibold text-gray-800">{formatDate(profile?.birth_date)}</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
										<CardTitle className="flex items-center gap-2 text-base sm:text-lg">
											<Settings className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
											Hesap İşlemleri
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
										<div className="rounded-lg sm:rounded-xl border bg-orange-50 p-3 sm:p-4">
											<p className="text-xs sm:text-sm text-orange-800">
												Profil düzenleme ve şifre değiştirme özellikleri yakında eklenecektir.
											</p>
										</div>
										<Button
											variant="outline"
											onClick={handleLogout}
											className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm"
										>
											<LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
											Hesaptan Çıkış Yap
										</Button>
									</CardContent>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</Layout>
	);
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
	return (
		<div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/60 px-3 sm:px-4 py-2.5 sm:py-3 gap-3">
			<div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
				<div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white shadow-sm border border-gray-100">
					<span className="text-gray-500">{icon}</span>
				</div>
				<span className="text-xs sm:text-sm text-gray-600 font-medium">{label}</span>
			</div>
			<span className="text-xs sm:text-sm font-semibold text-gray-800 max-w-[100px] sm:max-w-[180px] truncate text-right">{value}</span>
		</div>
	);
}

function EmptyState({
	icon,
	title,
	description,
	action,
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
	action: { href: string; label: string };
}) {
	return (
		<div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 sm:p-8 text-center">
			<div className="mx-auto w-fit rounded-full bg-orange-100 p-2.5 sm:p-3 text-orange-600 mb-2 sm:mb-3">
				{icon}
			</div>
			<h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">{title}</h3>
			<p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{description}</p>
			<Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">
				<Link href={action.href}>{action.label}</Link>
			</Button>
		</div>
	);
}
