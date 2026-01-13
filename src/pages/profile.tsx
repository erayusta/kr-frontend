import {
	BookOpen,
	Building2,
	Calendar,
	Hash,
	Heart,
	Layers,
	Mail,
	Phone,
	Settings,
	ShieldAlert,
	Tag,
	Trash2,
	User,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Layout } from "@/components/layouts/layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/hooks/useAuth";
import { useFavoritesState } from "@/hooks/useFavoritesState";
import { clearFavorites, setFavorited } from "@/lib/favorites";

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

type FavoriteCampaignUi = {
	id: string;
	title: string;
	merchant: string;
	badge?: string;
	summary: string;
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

function dummyCampaignFromId(id: string): FavoriteCampaignUi {
	const suffix = id.slice(-6);
	return {
		id,
		title: `Kampanya #${suffix}`,
		merchant: "Örnek Marka",
		badge: "Dummy",
		summary:
			"Şimdilik sadece favori ID’si tutuluyor. Sonra API ile kampanya detaylarını (başlık, marka, görsel, tarih) dolduracağız.",
	};
}

function StatCard({
	label,
	value,
	icon,
}: {
	label: string;
	value: number;
	icon: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm">
			<div className="rounded-lg bg-muted p-2 text-muted-foreground">
				{icon}
			</div>
			<div className="min-w-0">
				<p className="text-xs text-muted-foreground">{label}</p>
				<p className="text-lg font-semibold leading-6">{value}</p>
			</div>
		</div>
	);
}

export default function ProfilePage() {
	const { profile: rawProfile, isLoggedIn, loading } = useAuth();
	const profile = rawProfile as Profile | null;

	const { favorites, isReady } = useFavoritesState();

	const favoriteCampaigns = useMemo(() => {
		return (favorites?.campaign || []).map((id) =>
			dummyCampaignFromId(String(id)),
		);
	}, [favorites?.campaign]);

	const counts = {
		campaign: favorites?.campaign?.length || 0,
		post: favorites?.post?.length || 0,
		brand: favorites?.brand?.length || 0,
		category: favorites?.category?.length || 0,
	};

	const totalFavorites =
		counts.campaign + counts.post + counts.brand + counts.category;

	const statusBadge =
		typeof profile?.is_active === "boolean" ? (
			<Badge
				variant={profile.is_active ? "success" : "destructive"}
				className="gap-1"
			>
				{profile.is_active ? "Aktif" : "Pasif"}
			</Badge>
		) : null;

	return (
		<Layout>
			<div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
				<div className="space-y-5">
					<Card className="relative overflow-hidden">
						<div className="absolute inset-0 bg-gradient-to-br from-white to-[#fff6ea]" />
						<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ffdfb8] blur-3xl" />
						<div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#ffd2a3] blur-3xl" />

						<CardContent className="relative p-6">
							<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div className="flex items-center gap-4">
									<Avatar className="h-14 w-14 border bg-white shadow-sm">
										<AvatarFallback className="text-base font-semibold">
											{initialsFromName(profile?.name)}
										</AvatarFallback>
									</Avatar>

									<div className="min-w-0">
										{loading ? (
											<div className="space-y-2">
												<Skeleton className="h-7 w-52" />
												<Skeleton className="h-4 w-72" />
											</div>
										) : (
											<h1 className="text-2xl font-semibold tracking-tight">
												{isLoggedIn
													? `Hoş geldin, ${profile?.name || "Kullanıcı"}`
													: "Profil"}
											</h1>
										)}
									</div>
								</div>
							</div>

							{profile?.email || profile?.phone ? (
								<div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
									{profile?.email ? (
										<div className="flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 text-sm">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<span className="max-w-[320px] truncate">
												{profile.email}
											</span>
										</div>
									) : null}
									{profile?.phone ? (
										<div className="flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 text-sm">
											<Phone className="h-4 w-4 text-muted-foreground" />
											<span className="max-w-[220px] truncate">
												{profile.phone}
											</span>
										</div>
									) : null}
								</div>
							) : null}
						</CardContent>
					</Card>

					<Tabs defaultValue="favorites">
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
							<TabsList className="w-fit rounded-full border bg-white p-1 shadow-sm">
								<TabsTrigger
									value="favorites"
									className="gap-2 rounded-full data-[state=active]:bg-[#fff6ea] data-[state=active]:shadow-sm"
								>
									<Heart className="h-4 w-4" />
									Favoriler
								</TabsTrigger>
								<TabsTrigger
									value="settings"
									className="gap-2 rounded-full data-[state=active]:bg-[#fff6ea] data-[state=active]:shadow-sm"
								>
									<Settings className="h-4 w-4" />
									Ayarlar
								</TabsTrigger>
							</TabsList>

							<Button
								variant="outline"
								onClick={() => clearFavorites()}
								className="gap-2"
								disabled={!isReady || totalFavorites === 0}
							>
								<Trash2 className="h-4 w-4" />
								Tüm favorileri temizle
							</Button>
						</div>

						<TabsContent value="favorites" className="mt-4">
							<div className="grid gap-6">
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
									<StatCard
										label="Kampanya"
										value={counts.campaign}
										icon={<Tag className="h-4 w-4" />}
									/>
									<StatCard
										label="Blog"
										value={counts.post}
										icon={<BookOpen className="h-4 w-4" />}
									/>
									<StatCard
										label="Marka"
										value={counts.brand}
										icon={<Building2 className="h-4 w-4" />}
									/>
									<StatCard
										label="Kategori"
										value={counts.category}
										icon={<Layers className="h-4 w-4" />}
									/>
								</div>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center justify-between gap-3">
											<span>Favori Kampanyalar</span>
											{counts.campaign > 0 ? (
												<Badge variant="secondary">
													{counts.campaign} adet
												</Badge>
											) : null}
										</CardTitle>
									</CardHeader>

									<CardContent className="pt-0">
										{loading ? (
											<div className="grid gap-3 md:grid-cols-2">
												<Skeleton className="h-28 w-full" />
												<Skeleton className="h-28 w-full" />
											</div>
										) : counts.campaign === 0 ? (
											<div className="rounded-xl border bg-muted/20 p-6">
												<div className="flex items-start gap-3">
													<div className="rounded-lg bg-muted p-2">
														<ShieldAlert className="h-5 w-5" />
													</div>
													<div className="space-y-1">
														<p className="font-medium">Favori listesi boş</p>
														<p className="text-sm text-muted-foreground">
															Henüz bir kampanyayı favorilerine eklemedin.
														</p>
														<div className="pt-2">
															<Button asChild variant="secondary">
																<Link href="/">Kampanyaları keşfet</Link>
															</Button>
														</div>
													</div>
												</div>
											</div>
										) : (
											<div className="grid gap-3 md:grid-cols-2">
												{favoriteCampaigns.map((item) => (
													<Card key={item.id} className="overflow-hidden">
														<CardContent className="p-5">
															<div className="flex items-start justify-between gap-4">
																<div className="min-w-0">
																	<div className="flex items-center gap-2">
																		<p className="truncate font-semibold">
																			{item.title}
																		</p>
																		{item.badge ? (
																			<Badge variant="outline">
																				{item.badge}
																			</Badge>
																		) : null}
																	</div>
																	<p className="mt-1 text-sm text-muted-foreground">
																		{item.merchant}
																	</p>
																</div>

																<Button
																	variant="ghost"
																	size="icon"
																	aria-label="Favoriden kaldır"
																	onClick={() =>
																		setFavorited("campaign", item.id, false)
																	}
																>
																	<Heart className="h-5 w-5 fill-current" />
																</Button>
															</div>

															<p className="mt-3 max-h-10 overflow-hidden text-sm leading-5 text-muted-foreground">
																{item.summary}
															</p>

															<Separator className="my-4" />

															<div className="flex flex-wrap items-center justify-between gap-2">
																<p className="text-xs text-muted-foreground">
																	ID:{" "}
																	<span className="font-mono">{item.id}</span>
																</p>
																<div className="flex gap-2">
																	<Button variant="outline" size="sm" disabled>
																		Detay
																	</Button>
																	<Button
																		variant="secondary"
																		size="sm"
																		onClick={() => {
																			navigator.clipboard
																				?.writeText(item.id)
																				.catch(() => {});
																		}}
																	>
																		ID kopyala
																	</Button>
																</div>
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										)}

										{counts.campaign > 0 ? (
											<p className="mt-4 text-xs text-muted-foreground">
												Not: Şu an favorilerde sadece ID var. Bir sonraki adımda
												backend’den “ID → kampanya detayları” endpoint’iyle bu
												kartları gerçek verilerle dolduracağız.
											</p>
										) : null}
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="settings" className="mt-4">
							<div className="grid gap-6 md:grid-cols-2">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2">
											<User className="h-5 w-5" />
											Hesap Bilgileri
										</CardTitle>
									</CardHeader>

									<CardContent className="space-y-4">
										<div className="grid gap-3">
											<div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
												<div className="flex items-center gap-2 text-sm">
													<Hash className="h-4 w-4 text-muted-foreground" />
													<span className="text-muted-foreground">
														Kullanıcı ID
													</span>
												</div>
												<span className="text-sm font-medium">
													{profile?.id ?? "-"}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
												<div className="flex items-center gap-2 text-sm">
													<Mail className="h-4 w-4 text-muted-foreground" />
													<span className="text-muted-foreground">E-posta</span>
												</div>
												<span className="max-w-[260px] truncate text-sm font-medium">
													{profile?.email || "-"}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
												<div className="flex items-center gap-2 text-sm">
													<Phone className="h-4 w-4 text-muted-foreground" />
													<span className="text-muted-foreground">Telefon</span>
												</div>
												<span className="text-sm font-medium">
													{profile?.phone || "-"}
												</span>
											</div>
											<div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
												<div className="flex items-center gap-2 text-sm">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span className="text-muted-foreground">
														Üyelik tarihi
													</span>
												</div>
												<span className="text-sm font-medium">
													{formatDate(profile?.created_at)}
												</span>
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3">
											<div className="rounded-xl border bg-muted/20 p-3">
												<p className="text-xs text-muted-foreground">
													Cinsiyet
												</p>
												<p className="text-sm font-medium">
													{profile?.gender || "-"}
												</p>
											</div>
											<div className="rounded-xl border bg-muted/20 p-3">
												<p className="text-xs text-muted-foreground">
													Doğum tarihi
												</p>
												<p className="text-sm font-medium">
													{formatDate(profile?.birth_date)}
												</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader className="pb-3">
										<CardTitle className="flex items-center gap-2">
											<Settings className="h-5 w-5" />
											Ayarlar
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
											lorem ipsum
										</div>
										<Button variant="outline" disabled>
											lorem
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
