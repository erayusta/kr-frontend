
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, get } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input, InputLabel } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import apiRequest, { fetchData } from "@/lib/apiRequest";
import { X } from "lucide-react";


const formSchema = z.object({
 brand: z.string().nullable(),
 startDate: z.string().nullable(),
 endDate: z.string().nullable(),
 subCategory: z.string().nullable()
});

export default function CategoryFilterDialog({ slug, open, onClose }) {
 const router = useRouter();
 const [subCategories, setSubCategories] = useState([])
 const [brands, setBrands] = useState([])
 const methods = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
   brand: '',
   startDate: '',
   endDate: '',
   subCategory: '',
  },
 });

 useEffect(() => {
  const getBrands = async () => {
   try {
    const data = await apiRequest(`/categories/${slug}`,'get');
    setBrands(data.brands || [])
    setSubCategories(data.categories || [])
   } catch (error) {
    console.error('Failed to fetch category data:', error);
    setBrands([])
    setSubCategories([])
   }
  }

  getBrands()
 }, [])

 const onSubmit = (data) => {
  const query = Object.entries(data)
   .filter(([key, value]) => value)
   .map(([key, value]) => `${key}=${value}`)
   .join('&');
  router.push(`/kategori/${slug}?${query}`);
  onClose();
 };

 return (
  <FormProvider {...methods}>
   <Dialog open={open} onClose={onClose}>

    <DialogContent className="w-full">
     <DialogHeader>
      <DialogTitle>Filtrele</DialogTitle>
      <DialogDescription></DialogDescription>
     </DialogHeader>
     <form onSubmit={methods.handleSubmit(onSubmit)} className=" grid grid-cols-1 items-center gap-5">
      <div className="grid grid-cols-2 gap-5 items-center">
       {subCategories.length > 0 && <FormField
        control={methods.control}
        name="subCategory"
        render={({ field }) => (
         <FormItem className>
          <FormLabel>Alt Kategori</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
           <FormControl>
            <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Alt Kategori Seçiniz" />
            </SelectTrigger>
           </FormControl>

           <SelectContent position="popper">
            {subCategories.map(subCategory => (<SelectItem value={subCategory.slug}>{subCategory.name}</SelectItem>))}
           </SelectContent>
          </Select>

          <FormMessage />
         </FormItem>
        )}
       />}
       <FormField
        control={methods.control}
        name="brand"
        render={({ field }) => (
         <FormItem>
          <FormLabel>Marka</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
           <FormControl>
            <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Marka Seçiniz" />
            </SelectTrigger>
           </FormControl>

           <SelectContent position="popper">
            {brands.length > 0 && brands.map(brand => (<SelectItem value={brand.slug}>{brand.name}</SelectItem>))}

           </SelectContent>
          </Select>

          <FormMessage />
         </FormItem>
        )}
       />
      </div>

      <FormField
       control={methods.control}
       name="startDate"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Başlangıç Tarihi</FormLabel>
         <FormControl>
          <Input type="date" {...field} />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />

      <DialogFooter>
       <Button variant="ghost" onClick={onClose}>Temizle</Button>
       <Button type="submit">Uygula</Button>
      </DialogFooter>

     </form>
      <Button variant="ghost" onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </DialogContent>
   </Dialog>
  </FormProvider>
 );
}
