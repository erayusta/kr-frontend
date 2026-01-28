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
			className={`flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all hover:shadow-md w-full text-left ${
				active ? "bg-orange-50 border-orange-200" : "bg-white hover:bg-gray-50"
			}`}
		>
			<div className={`rounded-lg p-2 ${active ? "bg-orange-100 text-orange-600" : "bg-muted text-muted-foreground"}`}>
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-lg font-semibold leading-6">{value}</p>
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
				<div className="mx-auto w-full max-w-2xl px-4 py-20 text-center">
					<div className="rounded-2xl border bg-white p-10 shadow-sm">
						<User className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
						<h1 className="text-2xl font-semibold mb-2">Giriş Yapmanız Gerekiyor</h1>
						<p className="text-muted-foreground mb-6">
							Profil sayfasını görüntülemek için lütfen giriş yapın.
						</p>
						<Button asChild size="lg">
							<Link href="/giris">Giriş Yap</Link>
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
				<div className="space-y-6">
					{/* Profile Header */}
					<Card className="relative overflow-hidden border-0 shadow-lg">
						<div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400" />
						<div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

						<CardContent className="relative p-6 md:p-8">
							<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-5">
									<Avatar className="h-20 w-20 border-4 border-white/30 bg-white shadow-xl">
										<AvatarFallback className="text-2xl font-bold text-orange-600 bg-white">
											{initialsFromName(profile?.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0">
										{loading ? (
											<div className="space-y-2">
												<Skeleton className="h-8 w-52 bg-white/30" />
												<Skeleton className="h-5 w-72 bg-white/30" />
											</div>
										) : (
											<>
												<h1 className="text-2xl md:text-3xl font-bold text-white">
													{profile?.name || "Kullanıcı"}
												</h1>
												<p className="text-white/80 mt-1">
													{profile?.email}
												</p>
											</>
										)}
									</div>
								</div>

								<Button
									variant="secondary"
									onClick={handleLogout}
									className="gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
								>
									<LogOut className="h-4 w-4" />
									Çıkış Yap
								</Button>
							</div>

							{/* Quick Stats */}
							<div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-4 text-white">
									<p className="text-sm text-white/70">Favori Kampanya</p>
									<p className="text-2xl font-bold">{counts.campaign}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-4 text-white">
									<p className="text-sm text-white/70">Favori Marka</p>
									<p className="text-2xl font-bold">{counts.brand}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-4 text-white">
									<p className="text-sm text-white/70">Favori Kategori</p>
									<p className="text-2xl font-bold">{counts.category}</p>
								</div>
								<div className="rounded-xl bg-white/20 backdrop-blur-sm p-4 text-white">
									<p className="text-sm text-white/70">Üyelik Tarihi</p>
									<p className="text-lg font-semibold">{formatDate(profile?.created_at)}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Favorites Section */}
					<Tabs defaultValue="favorites" className="space-y-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<TabsList className="w-fit rounded-full border bg-white p-1 shadow-sm">
								<TabsTrigger
									value="favorites"
									className="gap-2 rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
								>
									<Heart className="h-4 w-4" />
									Favorilerim
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="gap-2 rounded-full data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
								>
									<Settings className="h-4 w-4" />
									Hesap Bilgileri
								</TabsTrigger>
							</TabsList>

							<Button
								variant="outline"
								onClick={handleClearAll}
								className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
								disabled={totalFavorites === 0}
							>
								<Trash2 className="h-4 w-4" />
								Tüm favorileri temizle
							</Button>
						</div>

						<TabsContent value="favorites" className="mt-0">
							{/* Category Tabs */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
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
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
											{[1, 2, 3].map((i) => (
												<Skeleton key={i} className="h-64 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.campaigns.length === 0 ? (
										<EmptyState
											icon={<Tag className="h-12 w-12" />}
											title="Favori kampanya yok"
											description="Henüz bir kampanyayı favorilerine eklemedin."
											action={{ href: "/", label: "Kampanyaları Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
										<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-32 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.brands.length === 0 ? (
										<EmptyState
											icon={<Building2 className="h-12 w-12" />}
											title="Favori marka yok"
											description="Henüz bir markayı favorilerine eklemedin."
											action={{ href: "/markalar", label: "Markaları Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
											{favoritesData.brands.map((brand) => (
												<Link
													key={brand.id}
													href={`/marka/${brand.slug}`}
													className="group"
												>
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
														<CardContent className="p-6 flex flex-col items-center text-center">
															{brand.logo ? (
																<img
																	src={brand.logo}
																	alt={brand.name}
																	className="h-16 w-auto object-contain mb-3"
																/>
															) : (
																<div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-3">
																	<Building2 className="h-8 w-8 text-orange-600" />
																</div>
															)}
															<p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
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
										<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
											{[1, 2, 3, 4].map((i) => (
												<Skeleton key={i} className="h-24 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.categories.length === 0 ? (
										<EmptyState
											icon={<Layers className="h-12 w-12" />}
											title="Favori kategori yok"
											description="Henüz bir kategoriyi favorilerine eklemedin."
											action={{ href: "/kategoriler", label: "Kategorileri Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
											{favoritesData.categories.map((category) => (
												<Link
													key={category.id}
													href={`/kategori/${category.slug}`}
													className="group"
												>
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
														<CardContent className="p-6 flex items-center gap-3">
															<div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
																<Layers className="h-6 w-6 text-orange-600" />
															</div>
															<p className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
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
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
											{[1, 2, 3].map((i) => (
												<Skeleton key={i} className="h-48 w-full rounded-xl" />
											))}
										</div>
									) : favoritesData.posts.length === 0 ? (
										<EmptyState
											icon={<BookOpen className="h-12 w-12" />}
											title="Favori blog yazısı yok"
											description="Henüz bir blog yazısını favorilerine eklemedin."
											action={{ href: "/blog", label: "Blog Yazılarını Keşfet" }}
										/>
									) : (
										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
											{favoritesData.posts.map((post) => (
												<Link key={post.id} href={`/blog/${post.slug}`} className="group">
													<Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
														{post.image && (
															<div className="aspect-video overflow-hidden">
																<img
																	src={post.image}
																	alt={post.title}
																	className="w-full h-full object-cover group-hover:scale-105 transition-transform"
																/>
															</div>
														)}
														<CardContent className="p-4">
															<p className="font-medium text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
																{post.title}
															</p>
															<p className="text-sm text-muted-foreground mt-2">
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
							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2">
											<User className="h-5 w-5 text-orange-600" />
											Hesap Bilgileri
										</CardTitle>
									</CardHeader>

									<CardContent className="space-y-4">
										<div className="grid gap-3">
											<InfoRow icon={<Hash className="h-4 w-4" />} label="Kullanıcı ID" value={profile?.id ?? "-"} />
											<InfoRow icon={<Mail className="h-4 w-4" />} label="E-posta" value={profile?.email || "-"} />
											<InfoRow icon={<Phone className="h-4 w-4" />} label="Telefon" value={profile?.phone || "-"} />
											<InfoRow icon={<Calendar className="h-4 w-4" />} label="Üyelik Tarihi" value={formatDate(profile?.created_at)} />
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="rounded-xl border bg-gray-50 p-3">
												<p className="text-xs text-muted-foreground">Cinsiyet</p>
												<p className="text-sm font-medium">{profile?.gender || "-"}</p>
											</div>
											<div className="rounded-xl border bg-gray-50 p-3">
												<p className="text-xs text-muted-foreground">Doğum Tarihi</p>
												<p className="text-sm font-medium">{formatDate(profile?.birth_date)}</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2">
											<Settings className="h-5 w-5 text-orange-600" />
											Hesap İşlemleri
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="rounded-xl border bg-orange-50 p-4">
											<p className="text-sm text-orange-800">
												Profil düzenleme ve şifre değiştirme özellikleri yakında eklenecektir.
											</p>
										</div>
										<Button
											variant="outline"
											onClick={handleLogout}
											className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
										>
											<LogOut className="h-4 w-4" />
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
		<div className="flex items-center justify-between rounded-xl border bg-gray-50 p-3">
			<div className="flex items-center gap-2 text-sm">
				<span className="text-muted-foreground">{icon}</span>
				<span className="text-muted-foreground">{label}</span>
			</div>
			<span className="text-sm font-medium max-w-[200px] truncate">{value}</span>
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
		<div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
			<div className="mx-auto w-fit rounded-full bg-orange-100 p-4 text-orange-600 mb-4">
				{icon}
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
			<p className="text-muted-foreground mb-6">{description}</p>
			<Button asChild variant="default" className="bg-orange-500 hover:bg-orange-600">
				<Link href={action.href}>{action.label}</Link>
			</Button>
		</div>
	);
}
