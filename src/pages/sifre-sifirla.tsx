import { CheckCircle, KeyRound, XCircle } from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";

interface ResetPasswordFormData {
	password: string;
	password_confirmation: string;
}

export default function ResetPasswordPage() {
	const router = useRouter();
	const { token, email } = router.query;
	const { toast } = useToast();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const form = useForm<ResetPasswordFormData>();

	useEffect(() => {
		if (router.isReady && (!token || !email)) {
			setIsError(true);
			setErrorMessage("Geçersiz şifre sıfırlama bağlantısı.");
		}
	}, [router.isReady, token, email]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (data.password !== data.password_confirmation) {
			toast({
				variant: "destructive",
				title: "Hata!",
				description: "Şifreler eşleşmiyor.",
			});
			return;
		}

		if (data.password.length < 6) {
			toast({
				variant: "destructive",
				title: "Hata!",
				description: "Şifre en az 6 karakter olmalıdır.",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			await apiRequest("/auth/reset-password", "post", {
				email,
				token,
				password: data.password,
				password_confirmation: data.password_confirmation,
			});
			setIsSuccess(true);
			toast({
				title: "Başarılı!",
				description: "Şifreniz başarıyla güncellendi.",
			});
		} catch (error: any) {
			setIsError(true);
			setErrorMessage(error?.response?.data?.error ?? "Şifre sıfırlanamadı.");
			toast({
				variant: "destructive",
				title: "Hata!",
				description: error?.response?.data?.error ?? "Şifre sıfırlanamadı.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Head>
				<title>Şifre Sıfırla - KampanyaRadar</title>
				<meta name="description" content="KampanyaRadar hesabınızın şifresini sıfırlayın" />
			</Head>

			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<div className="w-full max-w-md">
					<div className="bg-white rounded-2xl shadow-xl p-8">
						{isSuccess ? (
							<div className="text-center space-y-6">
								<div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
									<CheckCircle className="w-10 h-10 text-green-500" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">Şifre Güncellendi!</h1>
									<p className="text-gray-500">
										Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
									</p>
								</div>
								<Link href="/">
									<Button className="w-full bg-orange-500 hover:bg-orange-600">
										Ana Sayfaya Dön
									</Button>
								</Link>
							</div>
						) : isError ? (
							<div className="text-center space-y-6">
								<div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
									<XCircle className="w-10 h-10 text-red-500" />
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">Hata!</h1>
									<p className="text-gray-500">{errorMessage}</p>
								</div>
								<Link href="/">
									<Button className="w-full bg-orange-500 hover:bg-orange-600">
										Ana Sayfaya Dön
									</Button>
								</Link>
							</div>
						) : (
							<>
								<div className="text-center mb-8">
									<div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
										<KeyRound className="w-8 h-8 text-orange-500" />
									</div>
									<h1 className="text-2xl font-bold text-gray-900 mb-2">Yeni Şifre Belirle</h1>
									<p className="text-gray-500 text-sm">
										Hesabınız için yeni bir şifre belirleyin.
									</p>
								</div>

								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
									<div>
										<Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
											Yeni Şifre
										</Label>
										<Input
											id="password"
											type="password"
											placeholder="••••••••"
											className="w-full"
											{...form.register("password", {
												required: "Şifre gerekli",
												minLength: {
													value: 6,
													message: "Şifre en az 6 karakter olmalıdır",
												},
											})}
										/>
										{form.formState.errors.password && (
											<p className="text-red-500 text-sm mt-1">
												{form.formState.errors.password.message}
											</p>
										)}
									</div>

									<div>
										<Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
											Şifre Tekrar
										</Label>
										<Input
											id="password_confirmation"
											type="password"
											placeholder="••••••••"
											className="w-full"
											{...form.register("password_confirmation", {
												required: "Şifre tekrarı gerekli",
											})}
										/>
										{form.formState.errors.password_confirmation && (
											<p className="text-red-500 text-sm mt-1">
												{form.formState.errors.password_confirmation.message}
											</p>
										)}
									</div>

									<Button
										type="submit"
										className="w-full bg-orange-500 hover:bg-orange-600"
										disabled={isSubmitting}
									>
										{isSubmitting ? "Güncelleniyor..." : "Şifreyi Güncelle"}
									</Button>
								</form>

								<div className="mt-6 text-center">
									<Link
										href="/"
										className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
									>
										Ana Sayfaya Dön
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
