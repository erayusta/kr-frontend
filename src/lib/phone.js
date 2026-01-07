export function normalizeTRMobilePhone(input) {
	if (!input) return null;
	const digits = String(input).replace(/\D/g, "");

	// Accept: 05XXXXXXXXX, 5XXXXXXXXX, 905XXXXXXXXX, 00905XXXXXXXXX
	let national = digits;
	if (national.startsWith("0090")) national = national.slice(4);
	if (national.startsWith("90") && national.length === 12) national = national.slice(2);
	if (national.startsWith("0") && national.length === 11) national = national.slice(1);

	if (national.length !== 10) return null;
	if (!/^5\d{9}$/.test(national)) return null;

	// Disallow all-same-digit numbers like 5555555555
	if (/^(\d)\1{9}$/.test(national)) return null;

	return {
		national,
		e164: `+90${national}`,
	};
}

export function isValidTRMobilePhone(input) {
	return Boolean(normalizeTRMobilePhone(input));
}

