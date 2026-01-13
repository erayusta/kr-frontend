import { useEffect, useRef } from "react";
import { useSettings } from "@/hooks/useSettings";

interface Settings {
	head_after_code?: string;
	body_after_code?: string;
	body_end_code?: string;
}

export default function SettingsInjector() {
	const { settings } = useSettings();
	const injectedRef = useRef<{
		head_after_code?: string;
		body_after_code?: string;
		body_end_code?: string;
	}>({});

	useEffect(() => {
		const next = (settings || {}) as Settings;
		if (!Object.keys(next).length) return;

		const parser = new DOMParser();

		// Inject head_after_code using DOMParser
		if (
			next.head_after_code &&
			injectedRef.current.head_after_code !== next.head_after_code
		) {
			injectedRef.current.head_after_code = next.head_after_code;
			const doc = parser.parseFromString(next.head_after_code, "text/html");

			const allElements = [
				...Array.from(doc.head.children),
				...Array.from(doc.body.children),
			];

			allElements.forEach((element) => {
				if (element.tagName === "SCRIPT") {
					const script = document.createElement("script");

					Array.from(element.attributes).forEach((attr) => {
						script.setAttribute(attr.name, attr.value);
					});

					if (!(element as HTMLScriptElement).src) {
						script.textContent = element.textContent;
					}

					document.head.appendChild(script);
				} else {
					document.head.appendChild(element.cloneNode(true));
				}
			});
		}

		// Inject body_after_code (body start)
		if (
			next.body_after_code &&
			injectedRef.current.body_after_code !== next.body_after_code
		) {
			injectedRef.current.body_after_code = next.body_after_code;
			const doc = parser.parseFromString(next.body_after_code, "text/html");

			const allElements = [
				...Array.from(doc.head.children),
				...Array.from(doc.body.children),
			];

			allElements.forEach((element) => {
				document.body.insertBefore(
					element.cloneNode(true),
					document.body.firstChild,
				);
			});
		}

		// Inject body_end_code (before </body>)
		if (
			next.body_end_code &&
			injectedRef.current.body_end_code !== next.body_end_code
		) {
			injectedRef.current.body_end_code = next.body_end_code;
			const doc = parser.parseFromString(next.body_end_code, "text/html");

			const allElements = [
				...Array.from(doc.head.children),
				...Array.from(doc.body.children),
			];

			allElements.forEach((element) => {
				document.body.appendChild(element.cloneNode(true));
			});
		}
	}, [settings]);

	return null;
}
