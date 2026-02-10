import { useState, useId, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { X, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";
import { normalizeTRMobilePhone } from "@/lib/phone";

export default function CampaignFormWidget({ campaign }) {
	if (!campaign) return null;

	return <FormWidgetInner campaign={campaign} />;
}

function FormWidgetInner({ campaign }) {
	const [isOpen, setIsOpen] = useState(true);
	const [submitted, setSubmitted] = useState(false);
	const lastSubmitTime = useRef(0);
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
			website_url: "",
			consent: false,
		},
	});

	const onSubmit = useCallback(
		async (data) => {
			// Honeypot kontrolü — bot doldurursa sessizce "başarılı" göster
			if (data.website_url) {
				toast({
					title: "Başarılı!",
					description:
						"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
				});
				reset();
				setSubmitted(true);
				setIsOpen(false);
				return;
			}

			// Frontend rate limit — 30 saniyede 1 gönderim
			const now = Date.now();
			if (now - lastSubmitTime.current < 30000) {
				toast({
					title: "Hata!",
					description:
						"Lütfen birkaç saniye bekleyip tekrar deneyin.",
					variant: "destructive",
				});
				return;
			}

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

				// Honeypot alanını payload'dan sil
				delete payload.form_data.website_url;
				delete payload.form_data.consent;

				await apiRequest("/leads", "post", payload);

				lastSubmitTime.current = Date.now();

				toast({
					title: "Başarılı!",
					description:
						"Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
				});

				reset();
				setSubmitted(true);
				setIsOpen(false);
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
		},
		[campaign.id, toast, reset],
	);

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
			{/* Form Panel */}
			{isOpen && (
				<div className="w-[360px] max-h-[80vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-200 animate-in slide-in-from-bottom-4 fade-in duration-300">
					{/* Header */}
					<div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 rounded-t-2xl flex items-center justify-between">
						<div>
							<h3 className="text-white font-semibold text-base">
								Formu Doldurun, Size Ulaşalım
							</h3>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="text-white/80 hover:text-white transition-colors"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Form Body */}
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="p-5 space-y-4"
					>
						{/* Honeypot — botlar doldurur, CSS ile gizli */}
						<div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
							<input
								type="text"
								{...register("website_url")}
								autoComplete="off"
								tabIndex={-1}
							/>
						</div>

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
										: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
								}`}
							/>
							{errors.name && (
								<p className="text-xs text-red-500 mt-1">
									{errors.name.message}
								</p>
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
										: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
								}`}
							/>
							{errors.email && (
								<p className="text-xs text-red-500 mt-1">
									{errors.email.message}
								</p>
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
										return (
											normalized !== null ||
											"Geçerli bir telefon numarası girin"
										);
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
														: "border-gray-200 focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
												}`}
											/>
										)}
									</InputMask>
								)}
							/>
							{errors.phone && (
								<p className="text-xs text-red-500 mt-1">
									{errors.phone.message}
								</p>
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
								className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
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
							<p className="text-xs text-red-500 -mt-2">
								{errors.consent.message}
							</p>
						)}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? "Gönderiliyor..." : "Teklif Al"}
						</button>
					</form>
				</div>
			)}

			{/* Toggle Button */}
			{!submitted && (
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all text-sm font-medium ${
						isOpen
							? "bg-gray-800 text-white hover:bg-gray-900"
							: "bg-orange-500 text-white hover:bg-orange-600"
					}`}
				>
					{isOpen ? (
						<>
							<X className="h-4 w-4" />
							Kapat
						</>
					) : (
						<>
							<MessageSquare className="h-4 w-4" />
							Formu Göster
						</>
					)}
				</button>
			)}
		</div>
	);
}
