

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { LogIn, User2, UserCircle } from "lucide-react"
import Link from "next/link"
import apiRequest from "@/lib/apiRequest"
import { Checkbox } from "@/components/ui/checkbox";
import MaskedInput from 'react-text-mask';
import { useToast } from "@/components/ui/use-toast"

export default function AuthDialog() {

  const [activeTab, setActiveTab] = useState("login")
  const { register, handleSubmit, control, formState: { errors } } = useForm()
   const { toast } = useToast()

const onLoginSubmit = async (data) => {
    try {
      const response = await apiRequest("/auth/login", 'post', data)
      
       if (!response.token) {
        return toast({
          variant: "destructive",
          title: 'Hata!',
          description: response.message
        })
      }

     localStorage.setItem('token', response.token)
     return location.reload()
      
    } catch (error) {
    return toast({
          variant: "destructive",
          title: 'Hata!',
          description: error
        })
    }
  }

  const onRegisterSubmit = async (data) => {
    try {
      const response = await apiRequest("/auth/register",'post', data)
      console.log(data)
     if (!response.token) {
        return toast({
          variant: "destructive",
          title: 'Hata!',
          description: response.message
        })
      }

   localStorage.setItem('token', response.token)
     location.reload();

    } catch (error) {
      return toast({
          variant: "destructive",
          title: 'Hata!',
          description: error
        })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
         <Button
          className="h-9 flex gap-x-5 bg-orange-500 px-4 text-sm font-medium  text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-orange-600"
          variant="solid"
        >
          <User2 size={20}></User2> <span>Giriş Yap</span>
        </Button>      
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {activeTab === "login" && (
          <>
            <div className="flex items-center justify-center px-4">
              <div className="space-y-6 max-w-md w-full">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">Giriş Yap</h1>
                  <p className="text-gray-500 dark:text-gray-400">Hesabınıza erişmek için e-posta adresinizi ve şifrenizi girin.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onLoginSubmit)}>
                  
                  <div>
                    <Label htmlFor="login-email" className="block text-sm font-medium">
                      E-Posta Adresi
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="isim@gmail.com"
                      className="mt-1 block w-full"
                      {...register("email", { required: "E-posta adresi gerekli" ,pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Geçerli bir e-posta adresi girin"
                      }})}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="block text-sm font-medium">
                        Şifre
                      </Label>
                      <Link
                        href="#"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                        prefetch={false}
                      >
                        Şifreni mi Unuttun?
                      </Link>
                    </div>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 block w-full"
                      {...register("password", { required: "Şifre gerekli" })}
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
          </>
        )}
        {activeTab === "register" && (
          <div className="flex items-center justify-center px-4">
            <div className="space-y-6 max-w-md w-full">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight">Kayıt Ol</h1>
                <p className="text-gray-500 dark:text-gray-400">Hesabınızı oluşturmak Alanları Doğru şekilde doldurun.</p>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit(onRegisterSubmit)}>
                <div className="grid grid-cols-2 gap-x-3">
                 <div>
                    <Label htmlFor="email" className="block text-sm font-medium">
                      Ad
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder=""
                      className="mt-1 block w-full"
                      {...register("firstName", { required: "Ad gerekli"})}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="email" className="block text-sm font-medium">
                      Soyad
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder=""
                      className="mt-1 block w-full"
                      {...register("lastName", { required: "Soyisim gerekli" })}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
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
                    {...register("email", { required: "E-posta adresi gerekli" })}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium">
                   Telefon Numarası
                  </Label>
                <Controller
      name="phone"
      control={control}
      rules={{ required: 'Telefon numarası gerekli', pattern: { value: /^\+90 \([1-9]\d{2}\) \d{3}-\d{4}$/, message: 'Invalid phone number' } }}
      render={({ field }) => (
       <MaskedInput
       {...field}
   mask={[
    '+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/,
   ]}
   className={`flex h-10 w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-input'
    } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
   placeholder="+90 (___) ___-____"
   guide={false}
   id={'phone'}
  />
      )}
     />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium">
                    Şifre
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 block w-full"
                    {...register("password", { required: "Şifre gerekli" })}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div>
                  <Label htmlFor="cpassword" className="block text-sm font-medium">
                    Tekrar Şifre
                  </Label>
                  <Input
                    id="cpassword"
                    type="password"
                    placeholder="••••••••"
                    className="mt-1 block w-full"
                    {...register("passwordConfirmation", { required: "Tekrar Şifre gerekli" })}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                </div>
                 <div className="space-y-2 gap-x-4">
     <Checkbox className="mr-2" id={'accept'} {...register('accept')} />
     <Label htmlFor={'accept'} className="text-xs" >Kvkk Sözleşmesini Okudum ve Kabul Ediyorum.</Label>
  {errors.accept && <p className="text-red-500 text-xs">{errors.accept?.message}</p>}
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
  )
}
