import { useState, useId, useRef, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { X, MessageSquare, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";
import { normalizeTRMobilePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

/**
 * Dynamic Campaign Form Widget
 * Reads field definitions from campaign.lead_form.fields and generates the form dynamically.
 */
export default function CampaignFormWidget({ campaign }) {
	if (!campaign?.lead_form) return null;
	return <FormWidgetInner campaign={campaign} />;
}

function FormWidgetInner({ campaign }) {
	const leadForm = campaign.lead_form;
	const fields = leadForm.fields || [];

	const [isOpen, setIsOpen] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const lastSubmitTime = useRef(0);
	const formId = useId();
	const { toast } = useToast();

	// Build default values from field definitions
	const defaultValues = fields.reduce((acc, field) => {
		if (field.type === "multiselect") {
			acc[field.name] = [];
		} else if (field.type === "checkbox") {
			acc[field.name] = false;
		} else {
			acc[field.name] = "";
		}
		return acc;
	}, { website_url: "" });

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		control,
		watch,
	} = useForm({ defaultValues });

	// Brand logo fallback
	const formLogo =
		leadForm.logo ||
		campaign.brands?.[0]?.logo ||
		null;

	const onSubmit = useCallback(
		async (data) => {
			// Honeypot
			if (data.website_url) {
				toast({ title: "Başarılı!", description: "Form başarıyla gönderildi." });
				reset();
				setSubmitted(true);
				setIsOpen(false);
				return;
			}

			// Frontend rate limit — 30 saniye
			const now = Date.now();
			if (now - lastSubmitTime.current < 30000) {
				toast({
					title: "Hata!",
					description: "Lütfen birkaç saniye bekleyip tekrar deneyin.",
					variant: "destructive",
				});
				return;
			}

			// Build structured form_values with labels
			const form_values = fields.map((field) => {
				let value = data[field.name];
				if (Array.isArray(value)) value = value.join(", ");
				if (typeof value === "boolean") value = value ? "Evet" : "Hayır";
				return { name: field.name, label: field.label, value: String(value ?? "") };
			});

			// Extract root-level name / email / phone
			const extractVal = (...names) => {
				for (const n of names) {
					const fv = form_values.find((f) => f.name === n && f.value);
					if (fv) return fv.value;
				}
				return "";
			};

			const rawName =
				extractVal("name", "isim", "ad") ||
				[extractVal("first_name", "ad"), extractVal("last_name", "soyad")]
					.filter(Boolean)
					.join(" ") ||
				"İsimsiz";

			const rawEmail = extractVal("email", "eposta", "e_posta");

			const rawPhone = extractVal("phone", "telefon", "tel", "gsm");
			const normalizedPhone = rawPhone ? normalizeTRMobilePhone(rawPhone) : null;

			// Validate phone if form has a phone field (type="phone" OR name contains phone/telefon)
			const hasPhoneField = fields.some(
				(f) => f.type === "phone" || ["phone", "telefon", "tel", "gsm"].includes(f.name)
			);
			if (hasPhoneField && rawPhone && !normalizedPhone) {
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
					name: rawName,
					email: rawEmail,
					phone: normalizedPhone?.e164 || rawPhone || "",
					form_values,
					form_data: Object.fromEntries(
						Object.entries(data).filter(([k]) => k !== "website_url")
					),
				};

				await apiRequest("/leads", "post", payload);

				lastSubmitTime.current = Date.now();

				toast({
					title: "Başarılı!",
					description: "Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
				});

				reset();
				setSubmitted(true);
				setIsOpen(false);
			} catch (error) {
				toast({
					title: "Hata!",
					description:
						error.response?.data?.error ?? "Form gönderilemedi, lütfen tekrar deneyin.",
					variant: "destructive",
				});
			}
		},
		[campaign.id, fields, toast, reset]
	);

	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
			{/* Form Panel */}
			{isOpen && (
				<div className="w-[380px] max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 fade-in duration-300">
					{/* Header */}
					<div className="sticky top-0 z-10 bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 rounded-t-2xl">
						<div className="flex items-start justify-between gap-3">
							<div className="flex items-center gap-3 min-w-0">
								{formLogo && (
									// biome-ignore lint/performance/noImgElement: form logos are external URLs
									<img
										src={formLogo}
										alt={leadForm.title || "Form"}
										className="h-10 w-10 rounded-lg object-contain bg-white/20 p-1 flex-shrink-0"
									/>
								)}
								<div className="min-w-0">
									<h3 className="text-white font-semibold text-sm leading-tight truncate">
										{leadForm.title || "Formu Doldurun"}
									</h3>
									{leadForm.description && (
										<p className="text-orange-100 text-xs mt-0.5 line-clamp-2">
											{leadForm.description}
										</p>
									)}
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="text-white/80 hover:text-white transition-colors flex-shrink-0 mt-0.5"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Form Body */}
					<form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
						{/* Honeypot */}
						<div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true" tabIndex={-1}>
							<input
								type="text"
								{...register("website_url")}
								autoComplete="off"
								tabIndex={-1}
							/>
						</div>

						{fields.map((field) => (
							<DynamicField
								key={field.name}
								field={field}
								formId={formId}
								register={register}
								control={control}
								errors={errors}
								watch={watch}
							/>
						))}

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
						>
							{isSubmitting ? "Gönderiliyor..." : (leadForm.button_text || "Gönder")}
						</button>
					</form>
				</div>
			)}

			{/* Submitted State */}
			{submitted && (
				<div className="w-[320px] bg-white rounded-2xl shadow-xl border border-green-100 p-5 animate-in slide-in-from-bottom-4 fade-in duration-300 flex items-center gap-3">
					<CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
					<div>
						<p className="font-semibold text-gray-900 text-sm">Başvurunuz Alındı!</p>
						<p className="text-gray-500 text-xs mt-0.5">En kısa sürede sizinle iletişime geçeceğiz.</p>
					</div>
				</div>
			)}

			{/* Toggle Button */}
			{!submitted && (
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className={cn(
						"flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all text-sm font-medium",
						isOpen
							? "bg-gray-800 text-white hover:bg-gray-900"
							: "bg-orange-500 text-white hover:bg-orange-600"
					)}
				>
					{isOpen ? (
						<>
							<X className="h-4 w-4" />
							Kapat
						</>
					) : (
						<>
							<MessageSquare className="h-4 w-4" />
							{leadForm.button_text || "Formu Göster"}
						</>
					)}
				</button>
			)}
		</div>
	);
}

// ─── Dynamic Field Renderer ───────────────────────────────────────────────────

function DynamicField({ field, formId, register, control, errors, watch }) {
	const fieldId = `${formId}-${field.name}`;
	const error = errors[field.name];

	const inputClass = (hasError) =>
		cn(
			"w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors bg-white",
			hasError
				? "border-red-400 focus:ring-1 focus:ring-red-400"
				: "border-gray-200 focus:ring-1 focus:ring-orange-400 focus:border-orange-400"
		);

	const rules = buildRules(field);

	const label = (
		<label htmlFor={fieldId} className="block text-sm font-medium text-gray-700 mb-1.5">
			{field.label}
			{isRequired(field) && <span className="text-red-500 ml-0.5">*</span>}
		</label>
	);

	const errorMsg = error && (
		<p className="text-xs text-red-500 mt-1">{error.message}</p>
	);

	// ── text / email / number / date ──────────────────────────────────────────
	if (["text", "email", "number", "date"].includes(field.type)) {
		return (
			<div>
				{label}
				<input
					type={field.type}
					id={fieldId}
					{...register(field.name, rules)}
					placeholder={field.placeholder || ""}
					className={inputClass(!!error)}
				/>
				{errorMsg}
			</div>
		);
	}

	// ── phone ─────────────────────────────────────────────────────────────────
	if (field.type === "phone") {
		return (
			<div>
				{label}
				<Controller
					name={field.name}
					control={control}
					rules={rules}
					render={({ field: ctrl }) => (
						<InputMask
							mask="0599 999 99 99"
							value={ctrl.value}
							onChange={ctrl.onChange}
							onBlur={ctrl.onBlur}
						>
							{(inputProps) => (
								<input
									{...inputProps}
									type="tel"
									id={fieldId}
									autoComplete="tel"
									inputMode="numeric"
									placeholder={field.placeholder || "05xx xxx xx xx"}
									className={inputClass(!!error)}
								/>
							)}
						</InputMask>
					)}
				/>
				{errorMsg}
			</div>
		);
	}

	// ── textarea ──────────────────────────────────────────────────────────────
	if (field.type === "textarea") {
		return (
			<div>
				{label}
				<textarea
					id={fieldId}
					{...register(field.name, rules)}
					placeholder={field.placeholder || ""}
					rows={3}
					className={cn(inputClass(!!error), "resize-none")}
				/>
				{errorMsg}
			</div>
		);
	}

	// ── select ────────────────────────────────────────────────────────────────
	if (field.type === "select") {
		const options = field.options || [];
		return (
			<div>
				{label}
				<select
					id={fieldId}
					{...register(field.name, rules)}
					className={cn(inputClass(!!error), "cursor-pointer")}
				>
					<option value="">{field.placeholder || "Seçiniz..."}</option>
					{options.map((opt) => (
						<option key={opt} value={opt}>
							{opt}
						</option>
					))}
				</select>
				{errorMsg}
			</div>
		);
	}

	// ── multiselect ───────────────────────────────────────────────────────────
	if (field.type === "multiselect") {
		const options = field.options || [];
		return (
			<div>
				{label}
				<div className="space-y-2 border border-gray-200 rounded-lg p-3">
					{options.map((opt) => (
						<label key={opt} className="flex items-center gap-2 cursor-pointer group">
							<input
								type="checkbox"
								value={opt}
								{...register(field.name, rules)}
								className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
							/>
							<span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
						</label>
					))}
				</div>
				{errorMsg}
			</div>
		);
	}

	// ── checkbox (single — e.g. consent) ─────────────────────────────────────
	if (field.type === "checkbox") {
		return (
			<div>
				<div className="flex items-start gap-2">
					<input
						type="checkbox"
						id={fieldId}
						{...register(field.name, rules)}
						className="mt-0.5 h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
					/>
					{/* biome-ignore lint/security/noDangerouslySetInnerHtml: checkbox labels may contain safe HTML links */}
					<label
						htmlFor={fieldId}
						className="text-xs text-gray-500 cursor-pointer leading-relaxed"
						dangerouslySetInnerHTML={{ __html: field.label + (isRequired(field) ? ' <span class="text-red-500">*</span>' : '') }}
					/>
				</div>
				{errorMsg}
			</div>
		);
	}

	return null;
}

// ─── Build react-hook-form rules from field definition ────────────────────────

function isRequired(field) {
	return field.required === true || field.isRequired === true;
}

function buildRules(field) {
	const rules = {};
	const required = isRequired(field);

	if (required) {
		rules.required = `${field.label} zorunludur`;
	}

	if (field.type === "email") {
		rules.pattern = {
			value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
			message: "Geçerli bir e-posta adresi girin",
		};
	}

	if (field.type === "phone") {
		rules.validate = (value) => {
			if (!value && !required) return true;
			const normalized = normalizeTRMobilePhone(value);
			return normalized !== null || "Geçerli bir telefon numarası girin";
		};
	}

	if (field.type === "checkbox" && required) {
		rules.validate = (value) => value === true || `${field.label} onaylanmalıdır`;
	}

	if (field.type === "multiselect" && required) {
		rules.validate = (value) =>
			(Array.isArray(value) && value.length > 0) || "En az bir seçenek seçiniz";
	}

	return rules;
}
