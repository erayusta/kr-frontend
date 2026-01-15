import { useId } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";
import { normalizeTRMobilePhone } from "@/lib/phone";

/**
 * Unified Campaign Lead Form Component
 * 
 * @param {Object} props
 * @param {Object} props.campaign - Campaign object with id
 * @param {string} props.brandLogo - Optional brand logo URL
 * @param {string} props.brandName - Optional brand name
 * @param {string} props.variant - Form style variant: "product" (orange) or "car" (blue)
 */
export default function CampaignLeadForm({ 
	campaign, 
	brandLogo, 
	brandName,
	variant = "product" // "product" or "car"
}) {
	const formId = useId();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		control,
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			consent: false,
		},
	});

	const onSubmit = async (data) => {
		// Validate phone number
		const normalizedPhone = normalizeTRMobilePhone(data.phone);
		if (!normalizedPhone) {
			toast({
				title: "Hata!",
				description: "Lütfen geçerli bir cep telefonu numarası girin.",
				variant: "destructive",
			});
			return;
		}

		try {
			const payload = {
				campaign_id: campaign.id,
				name: data.name || "İsimsiz",
				email: data.email || "",
				phone: normalizedPhone.e164,
				form_data: { ...data, phone: normalizedPhone.e164 },
			};

			await apiRequest("/leads", "post", payload);

			toast({
				title: "Başarılı!",
				description:
					"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
			});

			// Reset form
			reset();
		} catch (error) {
			console.error("Form gönderimi başarısız:", error.response);
			toast({
				title: "Hata!",
				description:
					error.response?.data?.error ??
					"Form gönderilemedi, lütfen tekrar deneyin.",
				variant: "destructive",
			});
		}
	};

	// Determine color scheme based on variant
	const isCarVariant = variant === "car";

	return (
		<div className="rounded-xl border border-gray-100 p-5 sticky top-6 bg-white">
			{brandLogo && (
				<div className="flex justify-center mb-5">
					{/* biome-ignore lint/performance/noImgElement: Brand logos are external URLs and shown as-is. */}
					<img
						src={brandLogo}
						alt={brandName || "Marka"}
						className="h-14 object-contain"
					/>
				</div>
			)}

			<h2 className="text-center font-semibold text-gray-900 mb-5">
				Formu Doldurun,{" "}
				<span className={isCarVariant ? "text-blue-500" : "text-orange-500"}>
					Size Ulaşalım
				</span>
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{/* Name Field */}
				<div>
					<label
						htmlFor={`${formId}-name`}
						className="block text-sm text-gray-700 mb-1"
					>
						Ad Soyad <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						id={`${formId}-name`}
						{...register("name", {
							required: "Ad soyad zorunludur",
							minLength: {
								value: 3,
								message: "Ad soyad en az 3 karakter olmalıdır",
							},
						})}
						placeholder="Adınızı ve soyadınızı girin"
						className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
							errors.name
								? "border-red-500 focus:ring-1 focus:ring-red-500"
								: isCarVariant
									? "border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
									: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
						}`}
					/>
					{errors.name && (
						<p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
					)}
				</div>

				{/* Email Field */}
				<div>
					<label
						htmlFor={`${formId}-email`}
						className="block text-sm text-gray-700 mb-1"
					>
						E-posta Adresi <span className="text-red-500">*</span>
					</label>
					<input
						type="email"
						id={`${formId}-email`}
						{...register("email", {
							required: "E-posta adresi zorunludur",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Geçerli bir e-posta adresi girin",
							},
						})}
						placeholder="ornek@mail.com"
						className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
							errors.email
								? "border-red-500 focus:ring-1 focus:ring-red-500"
								: isCarVariant
									? "border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
									: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
						}`}
					/>
					{errors.email && (
						<p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
					)}
				</div>

				{/* Phone Field with Mask */}
				<div>
					<label
						htmlFor={`${formId}-phone`}
						className="block text-sm text-gray-700 mb-1"
					>
						Telefon Numarası <span className="text-red-500">*</span>
					</label>
					<Controller
						name="phone"
						control={control}
						rules={{
							required: "Telefon numarası zorunludur",
							validate: (value) => {
								const normalized = normalizeTRMobilePhone(value);
								return normalized !== null || "Geçerli bir telefon numarası girin";
							},
						}}
						render={({ field }) => (
							<InputMask
								mask="0599 999 99 99"
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
							>
								{(inputProps) => (
									<input
										{...inputProps}
										type="tel"
										id={`${formId}-phone`}
										autoComplete="tel"
										inputMode="numeric"
										placeholder="05xx xxx xx xx"
										className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
											errors.phone
												? "border-red-500 focus:ring-1 focus:ring-red-500"
												: isCarVariant
													? "border-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
													: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
										}`}
									/>
								)}
							</InputMask>
						)}
					/>
					{errors.phone && (
						<p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
					)}
				</div>

				{/* Consent Checkbox */}
				<div className="flex items-start gap-2 pt-1">
					<input
						type="checkbox"
						id={`${formId}-consent`}
						{...register("consent", {
							required: "Açık rıza metnini kabul etmelisiniz",
						})}
						className={`mt-0.5 h-4 w-4 rounded border-gray-300 cursor-pointer ${
							isCarVariant
								? "text-blue-500 focus:ring-blue-500"
								: "text-orange-500 focus:ring-orange-500"
						}`}
					/>
					<label
						htmlFor={`${formId}-consent`}
						className="text-xs text-gray-500 cursor-pointer leading-relaxed"
					>
						Açık rıza metnini okudum ve kabul ediyorum.{" "}
						<span className="text-red-500">*</span>
					</label>
				</div>
				{errors.consent && (
					<p className="text-xs text-red-500 -mt-2">{errors.consent.message}</p>
				)}

				{/* Submit Button */}
				<button
					type="submit"
					disabled={isSubmitting}
					className={`w-full text-white font-medium py-3 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
						isCarVariant
							? "bg-blue-500 hover:bg-blue-600"
							: "bg-orange-500 hover:bg-orange-600"
					}`}
				>
					{isSubmitting ? "Gönderiliyor..." : "Teklif Al"}
				</button>
			</form>
		</div>
	);
}
