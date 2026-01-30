import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	CreditCard,
	Building2,
	Calendar,
	Banknote,
	ExternalLink,
	Calculator
} from "lucide-react";

export default function CampaignCreditType({ campaign }) {
	const credit = campaign?.credit;

	if (!credit) return null;

	// Kredi türü etiketleri
	const loanTypeLabels = {
		personal: "İhtiyaç Kredisi",
		mortgage: "Konut Kredisi",
		auto: "Taşıt Kredisi",
		used_car: "İkinci El Taşıt Kredisi",
	};

	// Kredi türü ikonları
	const loanTypeIcons = {
		personal: "💳",
		mortgage: "🏠",
		auto: "🚗",
		used_car: "🚙",
	};

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("tr-TR", {
			style: "currency",
			currency: "TRY",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	const loanType = credit.loan_type || "personal";
	const defaultAmount = credit.defaults?.amount || 10000;
	const defaultMonths = credit.defaults?.months || 12;
	const bank = credit.bank;

	return (
		<div className="w-full mb-8">
			<div className="max-w-2xl mx-auto px-6">
				<div className="relative overflow-visible">
					{/* Kredi Kartı */}
					<div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-2 border-dashed border-blue-300 rounded-2xl px-8 py-8 shadow-lg">
						{/* Üst Kısım - Banka ve Kredi Türü */}
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-blue-200">
							{/* Banka Logosu ve Adı */}
							{bank && (
								<div className="flex items-center gap-3">
									{bank.logo && (
										<div className="w-16 h-16 bg-white rounded-xl p-2 shadow-sm border border-gray-100">
											<Image
												src={bank.logo}
												alt={bank.name}
												width={64}
												height={64}
												className="w-full h-full object-contain"
											/>
										</div>
									)}
									<div>
										<p className="text-sm text-gray-500">Banka</p>
										<p className="font-bold text-lg text-gray-900">{bank.name}</p>
									</div>
								</div>
							)}

							{/* Kredi Türü Badge */}
							<div className="flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
								<span className="text-xl">{loanTypeIcons[loanType]}</span>
								<span className="font-semibold text-blue-800">
									{loanTypeLabels[loanType]}
								</span>
							</div>
						</div>

						{/* Orta Kısım - Kredi Detayları */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
							{/* Varsayılan Tutar */}
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
								<div className="flex items-center gap-2 mb-2">
									<Banknote className="h-5 w-5 text-green-600" />
									<span className="text-sm text-gray-500">Kredi Tutarı</span>
								</div>
								<p className="text-2xl font-bold text-gray-900">
									{formatCurrency(defaultAmount)}
								</p>
							</div>

							{/* Varsayılan Vade */}
							<div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
								<div className="flex items-center gap-2 mb-2">
									<Calendar className="h-5 w-5 text-blue-600" />
									<span className="text-sm text-gray-500">Vade Süresi</span>
								</div>
								<p className="text-2xl font-bold text-gray-900">
									{defaultMonths} <span className="text-lg font-normal text-gray-500">Ay</span>
								</p>
							</div>
						</div>

						{/* Alt Kısım - Aksiyon Butonları */}
						<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
							{campaign.link && (
								<Button
									asChild
									size="lg"
									className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 w-full sm:w-auto"
								>
									<a href={campaign.link} target="_blank" rel="noopener noreferrer">
										<Calculator className="h-5 w-5 mr-2" />
										Kredi Hesapla
									</a>
								</Button>
							)}

							{bank?.slug && (
								<Button
									asChild
									variant="outline"
									size="lg"
									className="border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold px-8 w-full sm:w-auto"
								>
									<a href={`/marka/${bank.slug}`}>
										<Building2 className="h-5 w-5 mr-2" />
										Banka Detayları
									</a>
								</Button>
							)}
						</div>

						{/* Sol ve Sağ Daireler (Kupon Efekti) */}
						<div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
						<div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 bg-gray-50 rounded-full shadow-inner"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
