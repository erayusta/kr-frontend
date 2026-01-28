import {
	BookOpen,
	Building2,
	Calendar,
	Hash,
	Heart,
	Layers,
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

type FavoriteBrand = {
	id: number;
	name: string;
	slug: string;
	logo: string;
};

type FavoriteCategory = {
	id: number;
	name: string;
	slug: string;
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
			className={`flex items-center gap-2 sm:gap-3 rounded-xl border p-2.5 sm:p-3 shadow-sm transition-all hover:shadow-md w-full text-left ${
				active ? "bg-orange-50 border-orange-200" : "bg-white hover:bg-gray-50"
			}`}
		>
			<div className={`rounded-lg p-1.5 sm:p-2 shrink-0 ${active ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-[10px] sm:text-xs text-muted-foreground truncate">{label}</p>
				<p className="text-base sm:text-lg font-semibold leading-5 sm:leading-6">{value}</p>
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
		brands: FavoriteBrand[];
		categories: FavoriteCategory[];
	}>({ campaigns: [], posts: [], brands: [], categories: [] });
	const [counts, setCounts] = useState({ campaign: 0, post: 0, brand: 0, category: 0 });
	const [favoritesLoading, setFavoritesLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<"campaigns" | "brands" | "categories" | "posts">("campaigns");

	useEffect(() => {
		if (isLoggedIn) {
			loadFavorites();
		}
	}, [isLoggedIn]);

	const loadFavorites = async () => {
		try {
			setFavoritesLoading(true);
			const result = await fetchFavoritesDetails();
			setFavoritesData(result.data);
			setCounts(result.counts);
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
		setFavoritesData({ campaigns: [], posts: [], brands: [], categories: [] });
		setCounts({ campaign: 0, post: 0, brand: 0, category: 0 });
	};

	const handleLogout = () => {
		logout();
		router.push("/");
	};

	const totalFavorites = counts.campaign + counts.post + counts.brand + counts.category;

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
					<Card className="relative overflow-hidden border-0 shadow-lg rounded-2xl">
						<div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400" />

						<CardContent className="relative p-4 sm:p-6 md:p-8">
							<div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-3 sm:gap-5">
									<Avatar className="h-14 w-14 sm:h-20 sm:w-20 border-4 border-white/30 bg-white shadow-xl shrink-0">
										<AvatarFallback className="text-xl sm:text-2xl font-bold text-orange-600 bg-white">
											{initialsFromName(profile?.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0 flex-1">
										{loading ? (
											<div className="space-y-2">
												<Skeleton className="h-6 sm:h-8 w-40 sm:w-52 bg-white/30" />
												<Skeleton className="h-4 sm:h-5 w-48 sm:w-72 bg-white/30" />
											</div>
										) : (
											<>
												<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">
													{profile?.name || "Kullanıcı"}
												</h1>
												<p className="text-white/80 mt-1 text-sm sm:text-base truncate">
													{profile?.email}
												</p>
											</>
										)}
									</div>
								</div>

								<Button
									variant="secondary"
									onClick={handleLogout}
									className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm w-full sm:w-auto"
								>
									<LogOut className="h-4 w-4" />
									Çıkış Yap
								</Button>
							</div>

							{/* Quick Stats */}
							<div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 sm:p-4 text-white">
									<p className="text-xs sm:text-sm text-white/70">Favori Kampanya</p>
									<p className="text-xl sm:text-2xl font-bold">{counts.campaign}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 sm:p-4 text-white">
									<p className="text-xs sm:text-sm text-white/70">Favori Marka</p>
									<p className="text-xl sm:text-2xl font-bold">{counts.brand}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 sm:p-4 text-white">
									<p className="text-xs sm:text-sm text-white/70">Favori Kategori</p>
									<p className="text-xl sm:text-2xl font-bold">{counts.category}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-3 sm:p-4 text-white">
									<p className="text-xs sm:text-sm text-white/70">Üyelik Tarihi</p>
									<p className="text-sm sm:text-lg font-semibold">{formatDate(profile?.created_at)}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Favorites Section */}
					<Tabs defaultValue="favorites" className="space-y-4 sm:space-y-6">
						<div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
							<TabsList className="w-full sm:w-fit rounded-full border bg-white p-1 shadow-sm">
								<TabsTrigger
									value="favorites"
									className="flex-1 sm:flex-none gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
								>
									<Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
									Favorilerim
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="flex-1 sm:flex-none gap-1.5 sm:gap-2 rounded-full text-xs sm:text-sm data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
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
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
								<StatCard
									label="Kampanyalar"
									value={counts.campaign}
									icon={<Tag className="h-4 w-4" />}
									active={activeTab === "campaigns"}
									onClick={() => setActiveTab("campaigns")}
								/>
								<StatCard
									label="Markalar"
									value={counts.brand}
									icon={<Building2 className="h-4 w-4" />}
									active={activeTab === "brands"}
									onClick={() => setActiveTab("brands")}
								/>
								<StatCard
									label="Kategoriler"
									value={counts.category}
									icon={<Layers className="h-4 w-4" />}
									active={activeTab === "categories"}
									onClick={() => setActiveTab("categories")}
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
										<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
											{[1, 2, 3].map((i) => (
												<Skeleton key={i} className="h-56 sm:h-64 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.campaigns.length === 0 ? (
										<EmptyState
											icon={<Tag className="h-10 w-10 sm:h-12 sm:w-12" />}
											title="Favori kampanya yok"
											description="Henüz bir kampanyayı favorilerine eklemedin."
											action={{ href: "/", label: "Kampanyaları Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
											{favoritesData.campaigns.map((campaign) => (
												<div key={campaign.id} className="relative group">
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

							{/* Brands */}
							{activeTab === "brands" && (
								<div>
									{favoritesLoading ? (
										<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-28 sm:h-32 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.brands.length === 0 ? (
										<EmptyState
											icon={<Building2 className="h-10 w-10 sm:h-12 sm:w-12" />}
											title="Favori marka yok"
											description="Henüz bir markayı favorilerine eklemedin."
											action={{ href: "/markalar", label: "Markaları Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
											{favoritesData.brands.map((brand) => (
												<Link
													key={brand.id}
													href={`/marka/${brand.slug}`}
													className="group"
												>
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
														<CardContent className="p-4 sm:p-6 flex flex-col items-center text-center">
															{brand.logo ? (
																<img
																	src={brand.logo}
																	alt={brand.name}
																	className="h-12 sm:h-16 w-auto object-contain mb-2 sm:mb-3"
																/>
															) : (
																<div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-orange-100 flex items-center justify-center mb-2 sm:mb-3">
																	<Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
																</div>
															)}
															<p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors text-sm sm:text-base truncate w-full">
																{brand.name}
															</p>
														</CardContent>
													</Card>
												</Link>
											))}
										</div>
									)}
								</div>
							)}

							{/* Categories */}
							{activeTab === "categories" && (
								<div>
									{favoritesLoading ? (
										<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-20 sm:h-24 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.categories.length === 0 ? (
										<EmptyState
											icon={<Layers className="h-10 w-10 sm:h-12 sm:w-12" />}
											title="Favori kategori yok"
											description="Henüz bir kategoriyi favorilerine eklemedin."
											action={{ href: "/kategoriler", label: "Kategorileri Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
											{favoritesData.categories.map((category) => (
												<Link
													key={category.id}
													href={`/kategori/${category.slug}`}
													className="group"
												>
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
														<CardContent className="p-3 sm:p-6 flex items-center gap-2 sm:gap-3">
															<div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
																<Layers className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
															</div>
															<p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors text-sm sm:text-base line-clamp-2">
																{category.name}
															</p>
														</CardContent>
													</Card>
												</Link>
											))}
										</div>
									)}
								</div>
							)}

							{/* Posts */}
							{activeTab === "posts" && (
								<div>
									{favoritesLoading ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
											{[1, 2, 3].map((i) => (
												<Skeleton key={i} className="h-40 sm:h-48 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.posts.length === 0 ? (
										<EmptyState
											icon={<BookOpen className="h-10 w-10 sm:h-12 sm:w-12" />}
											title="Favori blog yazısı yok"
											description="Henüz bir blog yazısını favorilerine eklemedin."
											action={{ href: "/blog", label: "Blog Yazılarını Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
											{favoritesData.posts.map((post) => (
												<Link key={post.id} href={`/blog/${post.slug}`} className="group">
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
														{post.image && (
															<div className="aspect-video overflow-hidden">
																<img
																	src={post.image}
																	alt={post.title}
																	className="w-full h-full object-cover group-hover:scale-105 transition-transform"
																/>
															</div>
														)}
														<CardContent className="p-3 sm:p-4">
															<p className="font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors text-sm sm:text-base">
																{post.title}
															</p>
															<p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
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
											<div className="rounded-lg sm:rounded-xl border bg-gray-50 p-2.5 sm:p-3">
												<p className="text-[10px] sm:text-xs text-muted-foreground">Cinsiyet</p>
												<p className="text-xs sm:text-sm font-medium">{profile?.gender || "-"}</p>
											</div>
											<div className="rounded-lg sm:rounded-xl border bg-gray-50 p-2.5 sm:p-3">
												<p className="text-[10px] sm:text-xs text-muted-foreground">Doğum Tarihi</p>
												<p className="text-xs sm:text-sm font-medium">{formatDate(profile?.birth_date)}</p>
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
		<div className="flex items-center justify-between rounded-lg sm:rounded-xl border bg-gray-50 p-2.5 sm:p-3 gap-2">
			<div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shrink-0">
				<span className="text-muted-foreground">{icon}</span>
				<span className="text-muted-foreground">{label}</span>
			</div>
			<span className="text-xs sm:text-sm font-medium max-w-[120px] sm:max-w-[200px] truncate text-right">{value}</span>
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
		<div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 sm:p-12 text-center">
			<div className="mx-auto w-fit rounded-full bg-orange-100 p-3 sm:p-4 text-orange-600 mb-3 sm:mb-4">
				{icon}
			</div>
			<h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2">{title}</h3>
			<p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{description}</p>
			<Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600 text-sm sm:text-base">
				<Link href={action.href}>{action.label}</Link>
			</Button>
		</div>
	);
}
