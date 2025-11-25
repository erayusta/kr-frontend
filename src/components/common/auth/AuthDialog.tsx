import { User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import MaskedInput from "react-text-mask";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import apiRequest from "@/lib/apiRequest";

interface LoginFormData {
	email: string;
	password: string;
}

interface RegisterFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	password: string;
	passwordConfirmation: string;
	accept: boolean;
}

const AuthDialog = () => {
	const [activeTab, setActiveTab] = useState<"login" | "register">("login");
	const { toast } = useToast();

	const loginForm = useForm<LoginFormData>();
	const registerForm = useForm<RegisterFormData>({
		defaultValues: {
			accept: false,
		},
		shouldFocusError: false,
	});

	const onLoginSubmit = async (data: LoginFormData) => {
		try {
			const response: any = await apiRequest("/auth/login", "post", data);

			if (!response.token) {
				return toast({
					variant: "destructive",
					title: "Hata!",
					description: "Giriş yapılamadı",
				});
			}

			localStorage.setItem("token", response.token);
			location.reload();
		} catch (error: any) {
			console.log("hocam", error);
			toast({
				variant: "destructive",
				title: "Hata!",
				description:
					error?.response?.data?.message || error?.message || "Bir hata oluştu",
			});
		}
	};

	const onRegisterSubmit = async (data: RegisterFormData) => {
		if (!data.accept) {
			return toast({
				variant: "destructive",
				title: "Hata!",
				description: "KVKK sözleşmesini kabul etmelisiniz",
			});
		}

		try {
			const response: any = await apiRequest("/auth/register", "post", data);

			if (!response.token) {
				return toast({
					variant: "destructive",
					title: "Hata!",
					description: response.message || "Kayıt oluşturulamadı",
				});
			}

			localStorage.setItem("token", response.token);
			location.reload();
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Hata!",
				description:
					error?.response?.data?.message || error?.message || "Bir hata oluştu",
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-9 flex gap-x-5 bg-orange-500 px-4 text-sm font-medium text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-600">
					<User2 size={20} />
					<span>Giriş Yap</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				{activeTab === "login" ? (
					<div className="flex items-center justify-center px-4">
						<div className="space-y-6 max-w-md w-full">
							<div className="space-y-2 text-center">
								<h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
								<p className="text-gray-500 dark:text-gray-400">
									Hesabınıza erişmek için e-posta adresinizi ve şifrenizi girin.
								</p>
							</div>
							<form
								className="space-y-4"
								onSubmit={loginForm.handleSubmit(onLoginSubmit)}
							>
								<div>
									<Label
										htmlFor="login-email"
										className="block text-sm font-medium"
									>
										E-Posta Adresi
									</Label>
									<Input
										id="login-email"
										type="email"
										placeholder="isim@gmail.com"
										className="mt-1 block w-full"
										{...loginForm.register("email", {
											required: "E-posta adresi gerekli",
											pattern: {
												value:
													/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
												message: "Geçerli bir e-posta adresi girin",
											},
										})}
									/>
									{loginForm.formState.errors.email && (
										<p className="text-red-500 text-sm mt-1">
											{loginForm.formState.errors.email.message}
										</p>
									)}
								</div>
								<div>
									<div className="flex items-center justify-between">
										<Label
											htmlFor="login-password"
											className="block text-sm font-medium"
										>
											Şifre
										</Label>
										<Link
											href="#"
											className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
										>
											Şifreni mi Unuttun?
										</Link>
									</div>
									<Input
										id="login-password"
										type="password"
										placeholder="••••••••"
										className="mt-1 block w-full"
										{...loginForm.register("password", {
											required: "Şifre gerekli",
										})}
									/>
									{loginForm.formState.errors.password && (
										<p className="text-red-500 text-sm mt-1">
											{loginForm.formState.errors.password.message}
										</p>
									)}
								</div>
								<Button type="submit" className="w-full">
									Giriş Yap
								</Button>
							</form>
							<p className="text-center text-sm text-gray-600 dark:text-gray-400">
								Kayıtlı Değil Misin?{" "}
								<Button
									variant="ghost"
									onClick={() => setActiveTab("register")}
									className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
								>
									Kayıt Ol
								</Button>
							</p>
						</div>
					</div>
				) : (
					<div className="flex items-center justify-center px-4">
						<div className="space-y-6 max-w-md w-full">
							<div className="space-y-2 text-center">
								<h1 className="text-3xl font-bold tracking-tight">Kayıt Ol</h1>
								<p className="text-gray-500 dark:text-gray-400">
									Hesabınızı oluşturmak için alanları doğru şekilde doldurun.
								</p>
							</div>
							<form
								className="space-y-4"
								onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
							>
								<div className="grid grid-cols-2 gap-x-3">
									<div>
										<Label
											htmlFor="firstName"
											className="block text-sm font-medium"
										>
											Ad
										</Label>
										<Input
											id="firstName"
											type="text"
											className="mt-1 block w-full"
											{...registerForm.register("firstName", {
												required: "Ad gerekli",
											})}
										/>
										{registerForm.formState.errors.firstName && (
											<p className="text-red-500 text-sm mt-1">
												{registerForm.formState.errors.firstName.message}
											</p>
										)}
									</div>
									<div>
										<Label
											htmlFor="lastName"
											className="block text-sm font-medium"
										>
											Soyad
										</Label>
										<Input
											id="lastName"
											type="text"
											className="mt-1 block w-full"
											{...registerForm.register("lastName", {
												required: "Soyad gerekli",
											})}
										/>
										{registerForm.formState.errors.lastName && (
											<p className="text-red-500 text-sm mt-1">
												{registerForm.formState.errors.lastName.message}
											</p>
										)}
									</div>
								</div>
								<div>
									<Label htmlFor="email" className="block text-sm font-medium">
										E-Posta Adresi
									</Label>
									<Input
										id="email"
										type="email"
										placeholder="isim@gmail.com"
										className="mt-1 block w-full"
										{...registerForm.register("email", {
											required: "E-posta adresi gerekli",
											pattern: {
												value:
													/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
												message: "Geçerli bir e-posta adresi girin",
											},
										})}
									/>
									{registerForm.formState.errors.email && (
										<p className="text-red-500 text-sm mt-1">
											{registerForm.formState.errors.email.message}
										</p>
									)}
								</div>
								<div>
									<Label htmlFor="phone" className="block text-sm font-medium">
										Telefon Numarası
									</Label>
									<Controller
										name="phone"
										control={registerForm.control}
										rules={{
											required: "Telefon numarası gerekli",
											pattern: {
												value: /^\+90 \([1-9]\d{2}\) \d{3}-\d{4}$/,
												message: "Geçersiz telefon numarası",
											},
											shouldUnregister: false,
										}}
										render={({ field }) => (
											<MaskedInput
												{...field}
												mask={[
													"+",
													"9",
													"0",
													" ",
													"(",
													/[1-9]/,
													/\d/,
													/\d/,
													")",
													" ",
													/\d/,
													/\d/,
													/\d/,
													"-",
													/\d/,
													/\d/,
													/\d/,
													/\d/,
												]}
												className={`flex h-10 w-full rounded-md border ${
													registerForm.formState.errors.phone
														? "border-red-500"
														: "border-input"
												} bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
												placeholder="+90 (___) ___-____"
												guide={false}
												id="phone"
											/>
										)}
									/>
									{registerForm.formState.errors.phone && (
										<p className="text-red-500 text-sm mt-1">
											{registerForm.formState.errors.phone.message}
										</p>
									)}
								</div>
								<div>
									<Label
										htmlFor="password"
										className="block text-sm font-medium"
									>
										Şifre
									</Label>
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										className="mt-1 block w-full"
										{...registerForm.register("password", {
											required: "Şifre gerekli",
										})}
									/>
									{registerForm.formState.errors.password && (
										<p className="text-red-500 text-sm mt-1">
											{registerForm.formState.errors.password.message}
										</p>
									)}
								</div>
								<div>
									<Label
										htmlFor="passwordConfirmation"
										className="block text-sm font-medium"
									>
										Tekrar Şifre
									</Label>
									<Input
										id="passwordConfirmation"
										type="password"
										placeholder="••••••••"
										className="mt-1 block w-full"
										{...registerForm.register("passwordConfirmation", {
											required: "Tekrar şifre gerekli",
										})}
									/>
									{registerForm.formState.errors.passwordConfirmation && (
										<p className="text-red-500 text-sm mt-1">
											{
												registerForm.formState.errors.passwordConfirmation
													.message
											}
										</p>
									)}
								</div>
								<div className="flex items-center space-x-2">
									<Controller
										name="accept"
										control={registerForm.control}
										render={({ field }) => (
											<Checkbox
												id="accept"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										)}
									/>
									<Label htmlFor="accept" className="text-xs">
										Kvkk Sözleşmesini Okudum ve Kabul Ediyorum.
									</Label>
								</div>
								<Button type="submit" className="w-full">
									Kayıt Ol
								</Button>
							</form>
							<p className="text-center text-sm text-gray-600 dark:text-gray-400">
								Zaten hesabınız var mı?{" "}
								<Button
									variant="ghost"
									onClick={() => setActiveTab("login")}
									className="font-medium text-gray-900 hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-300"
								>
									Giriş Yap
								</Button>
							</p>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default AuthDialog;
