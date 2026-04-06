import { useRef, useId } from "react";
import { useForm, Controller } from "react-hook-form";
import InputMask from "react-input-mask";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";
import { normalizeTRMobilePhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

/**
 * Inline Campaign Lead Form — rendered inside campaign type components.
 * Reads field definitions from `campaign.lead_form.fields` and generates the form dynamically.
 *
 * @param {Object} props
 * @param {Object} props.campaign       - Campaign object with lead_form
 * @param {string} props.brandLogo      - Optional brand logo URL (fallback)
 * @param {string} props.brandName      - Optional brand name
 * @param {"product"|"car"} props.variant - Color scheme
 */
export default function CampaignLeadForm({
	campaign,
	brandLogo,
	brandName,
	variant = "product",
}) {
	if (!campaign?.lead_form) return null;

	return (
		<CampaignLeadFormInner
			campaign={campaign}
			brandLogo={brandLogo}
			brandName={brandName}
			variant={variant}
		/>
	);
}

function CampaignLeadFormInner({ campaign, brandLogo, brandName, variant }) {
	const leadForm = campaign.lead_form;
	const fields = leadForm.fields || [];
	const isCarVariant = variant === "car";
	const accentColor = isCarVariant ? "blue" : "orange";

	const formId = useId();
	const lastSubmitTime = useRef(0);
	const { toast } = useToast();

	const defaultValues = fields.reduce((acc, field) => {
		if (field.type === "multiselect") acc[field.name] = [];
		else if (field.type === "checkbox") acc[field.name] = false;
		else acc[field.name] = "";
		return acc;
	}, {});

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		control,
	} = useForm({ defaultValues });

	// Logo öncelik sırası: form logosu > prop olarak gelen marka logosu
	const displayLogo = leadForm.logo || brandLogo || null;
	// Başlık her zaman formdan gelir
	const displayName = leadForm.title || leadForm.name || null;

	const onSubmit = async (data) => {
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

		// Build structured form_values
		const form_values = fields.map((field) => {
			let value = data[field.name];
			if (Array.isArray(value)) value = value.join(", ");
			if (typeof value === "boolean") value = value ? "Evet" : "Hayır";
			return { name: field.name, label: field.label, value: String(value ?? "") };
		});

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
				form_data: { ...data },
			};

			await apiRequest("/leads", "post", payload);

			lastSubmitTime.current = Date.now();

			toast({
				title: "Başarılı!",
				description: "Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.",
			});

			reset();
		} catch (error) {
			toast({
				title: "Hata!",
				description:
					error.response?.data?.error ?? "Form gönderilemedi, lütfen tekrar deneyin.",
				variant: "destructive",
			});
		}
	};

	const focusRing = isCarVariant
		? "focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
		: "focus:ring-1 focus:ring-orange-500 focus:border-orange-500";

	const inputClass = (hasError) =>
		cn(
			"w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors bg-white",
			hasError ? "border-red-400 focus:ring-1 focus:ring-red-400" : `border-gray-200 ${focusRing}`
		);

	return (
		<div className="rounded-xl border border-gray-100 p-5 sticky top-6 bg-white shadow-sm">
			{/* Logo */}
			{displayLogo && (
				<div className="flex justify-center mb-4">
					{/* biome-ignore lint/performance/noImgElement: logos are external URLs */}
					<img
						src={displayLogo}
						alt={displayName || "Logo"}
						className="h-14 w-auto object-contain"
					/>
				</div>
			)}

			{/* Title */}
			<h2 className="text-center font-semibold text-gray-900 mb-1 text-base">
				{leadForm.title || "Formu Doldurun"}
			</h2>
			{leadForm.description && (
				<p className="text-center text-sm text-gray-500 mb-5 leading-relaxed">
					{leadForm.description}
				</p>
			)}
			{!leadForm.description && <div className="mb-5" />}

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				{fields.map((field) => (
					<InlineField
						key={field.name}
						field={field}
						formId={formId}
						register={register}
						control={control}
						errors={errors}
						inputClass={inputClass}
						accentColor={accentColor}
					/>
				))}

				{/* Submit */}
				<button
					type="submit"
					disabled={isSubmitting}
					className={cn(
						"w-full text-white font-semibold py-3 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed",
						isCarVariant
							? "bg-blue-500 hover:bg-blue-600 active:bg-blue-700"
							: "bg-orange-500 hover:bg-orange-600 active:bg-orange-700"
					)}
				>
					{isSubmitting ? "Gönderiliyor..." : (leadForm.button_text || "Gönder")}
				</button>
			</form>
		</div>
	);
}

// ─── Inline Field Renderer ────────────────────────────────────────────────────

function InlineField({ field, formId, register, control, errors, inputClass, accentColor }) {
	const fieldId = `${formId}-${field.name}`;
	const error = errors[field.name];
	const rules = buildRules(field);

	const label = (
		<label htmlFor={fieldId} className="block text-sm text-gray-700 mb-1">
			{field.label}
			{isRequired(field) && <span className="text-red-500 ml-0.5">*</span>}
		</label>
	);
	const errorMsg = error && (
		<p className="text-xs text-red-500 mt-1">{error.message}</p>
	);

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

	if (field.type === "select") {
		return (
			<div>
				{label}
				<select id={fieldId} {...register(field.name, rules)} className={cn(inputClass(!!error), "cursor-pointer")}>
					<option value="">{field.placeholder || "Seçiniz..."}</option>
					{(field.options || []).map((opt) => (
						<option key={opt} value={opt}>{opt}</option>
					))}
				</select>
				{errorMsg}
			</div>
		);
	}

	if (field.type === "multiselect") {
		return (
			<div>
				{label}
				<div className="space-y-2 border border-gray-200 rounded-lg p-3">
					{(field.options || []).map((opt) => (
						<label key={opt} className="flex items-center gap-2 cursor-pointer group">
							<input
								type="checkbox"
								value={opt}
								{...register(field.name, rules)}
								className={cn(
									"h-4 w-4 rounded border-gray-300 cursor-pointer",
									accentColor === "blue"
										? "text-blue-500 focus:ring-blue-400"
										: "text-orange-500 focus:ring-orange-400"
								)}
							/>
							<span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
						</label>
					))}
				</div>
				{errorMsg}
			</div>
		);
	}

	if (field.type === "checkbox") {
		return (
			<div>
				<div className="flex items-start gap-2 pt-1">
					<input
						type="checkbox"
						id={fieldId}
						{...register(field.name, rules)}
						className={cn(
							"mt-0.5 h-4 w-4 rounded border-gray-300 cursor-pointer",
							accentColor === "blue"
								? "text-blue-500 focus:ring-blue-500"
								: "text-orange-500 focus:ring-orange-500"
						)}
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

// ─── Build validation rules ───────────────────────────────────────────────────

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
