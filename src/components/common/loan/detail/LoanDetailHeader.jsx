import Link from "next/link";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
				<div className="rounded-2xl border bg-gradient-to-br from-orange-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-5 md:p-8 shadow-sm">
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
								<BreadcrumbPage>
									{loan?.title ? `${loan.title.substring(0, 25)}...` : "Detay"}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
						<div className="lg:col-span-5">
							<div className="flex items-start gap-4">
								<div className="rounded-xl bg-white/70 border p-3 shadow-sm dark:bg-gray-900/40">
									<img
										className="object-contain w-28 h-10"
										src={loan?.data?.logo}
										alt={loan?.data?.name || "Bank"}
									/>
								</div>

								<div className="flex-1 min-w-0">
									<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
										{loan?.title}
									</h1>

									<div className="mt-3 flex flex-wrap gap-2 items-center">
										<Badge variant="secondary" className="gap-2">
											<span
												className="text-sm"
												dangerouslySetInnerHTML={{ __html: getIcon(loanTypeName) }}
											/>
											<span>{loanTypeName || "Kredi"}</span>
										</Badge>

										{Number.isFinite(Number(amount)) && (
											<Badge variant="outline">Tutar: {amount}</Badge>
										)}
										{Number.isFinite(Number(maturity)) && (
											<Badge variant="outline">Vade: {maturity} ay</Badge>
										)}
										{approx && <Badge variant="success">Yaklasik</Badge>}
									</div>

									<div className="mt-5 flex flex-col sm:flex-row gap-3">
										{hasRedirect ? (
											<Button asChild className="sm:w-auto">
												<Link rel="nofollow" href={loan.data.redirect}>
													Hemen Basvur
												</Link>
											</Button>
										) : (
											<Button disabled className="sm:w-auto">
												Basvuru linki yok
											</Button>
										)}

										<Button asChild variant="outline" className="sm:w-auto">
											<Link href={backToOffersHref}>Tekliflere Don</Link>
										</Button>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7">
							<div className="rounded-xl border bg-white/70 dark:bg-gray-900/40 p-4 md:p-5 shadow-sm">
								<LoanApplicationPlan data={loan?.data} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
