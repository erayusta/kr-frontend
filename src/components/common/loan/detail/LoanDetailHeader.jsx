import Link from "next/link";
import { formatPrice } from "@/utils/loan";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getIcon } from "@/lib/utils";
import LoanApplicationPlan from "./LoanApplicationPlan";

export default function LoanDetailHeader({ loan }) {
	const loanTypeName = loan?.loanType?.name || "";
	const hasRedirect = Boolean(loan?.data?.redirect);
	const amount = loan?.data?.amount ?? loan?.data?.loanAmount ?? loan?.meta?.amount;
	const maturity = loan?.data?.maturity ?? loan?.data?.months ?? loan?.meta?.maturity;
	const approx = Boolean(loan?.data?.approx ?? loan?.data?.bracket?.approx);

	const backToOffersHref = loan?.loanType?.slug
		? `/kredi/${loan.loanType.slug}?amount=${amount ?? ""}&maturity=${maturity ?? ""}`
		: "/kredi";

	return (
		<section className="w-full">
			<div className="md:container px-4 py-6">
				<div className="rounded-2xl border bg-white dark:bg-gray-900 p-6 md:p-8 shadow-sm">
					<Breadcrumb className="breadcrumb mb-5">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/">Anasayfa</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/kredi">{loanTypeName || "Kredi"}</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>{loan?.title ? `${loan.title.substring(0, 25)}...` : "Detay"}</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
						<div className="lg:col-span-5">
							<div className="flex flex-col items-start gap-4">
								<div className="rounded-xl bg-white/80 border p-3 shadow-sm dark:bg-gray-900/40">
									{loan?.data?.logo ? (
										<img
											className="object-contain w-32 h-12 md:h-14"
											src={loan.data.logo}
											alt={loan?.data?.name || "Banka"}
										/>
									) : (
										<div className="w-32 h-12 md:h-14 bg-gray-100 flex items-center justify-center rounded">
											<span className="text-xs text-gray-400">{loan?.data?.name || "Banka"}</span>
										</div>
									)}
								</div>

								<div className="flex-1 min-w-0">
									<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white break-words line-clamp-2">
										{loan?.title}
									</h1>

									<div className="mt-3 flex flex-col items-start gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: getIcon(loanTypeName) }} />
                                  <span className="font-medium">{loanTypeName || "Kredi"}</span>
                                </div>

                                {Number.isFinite(Number(amount)) && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Tutar:</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(Number(amount))}</span>
                                  </div>
                                )}

                                {Number.isFinite(Number(maturity)) && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Vade:</span>
                                    <span className="font-semibold text-slate-900 dark:text-white">{maturity} ay</span>
                                  </div>
                                )}

                                {approx && (
                                  <div className="flex items-center gap-2 text-green-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    <span>Yaklaşık</span>
                                  </div>
                                )}
                              </div>

									<div className="mt-5 flex flex-col sm:flex-row gap-3">
										{hasRedirect ? (
											<Button asChild className="sm:w-auto text-white">
												<Link target="_blank" rel="nofollow noopener" href={loan.data.redirect}>
													Hemen Başvur
												</Link>
											</Button>
										) : (
											<Button disabled className="sm:w-auto">Başvuru linki yok</Button>
										)}

										<Button asChild variant="outline" className="sm:w-auto">
											<Link href={backToOffersHref}>Tekliflere Dön</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7">
							<div className="rounded-xl border bg-white dark:bg-gray-900/40 p-4 md:p-6 shadow-sm">
								<h3 className="text-sm font-medium text-muted-foreground mb-2">Kredi Özeti</h3>
								<LoanApplicationPlan data={loan?.data} />
								{approx && (
									<p className="mt-4 text-xs text-muted-foreground">Not: Bu teklif yaklaşık.</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
