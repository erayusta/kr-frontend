
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, get } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/router";
import { Dialog, DialogTitle, DialogContent, DialogFooter, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, InputLabel } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { useEffect, useState } from "react";
import { fetchData } from "@/lib/apiRequest";
import { X } from "lucide-react";
import { useMenu } from "@/context/menuContext";


const formSchema = z.object({
 brand: z.string().nullable(),
 startDate: z.string().nullable(),
 endDate: z.string().nullable(),
 subCategory: z.string().nullable()
});

export default function CategoryFilterDialog({ slug, open, onClose }) {
 const router = useRouter();
 const categories = useMenu()
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
      <div className="grid grid-cols-2">
       {categories.length > 0 && <FormField
        control={methods.control}
        name="category"
        render={({ field }) => (
         <FormItem className>
          <FormLabel>Kategori</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
           <FormControl>
            <SelectTrigger className="w-[180px]">
             <SelectValue placeholder="Kategori Seçiniz" />
            </SelectTrigger>
           </FormControl>

           <SelectContent position="popper">
            {categories.map(subCategory => (<SelectItem value={subCategory.slug}>{subCategory.name}</SelectItem>))}
           </SelectContent>
          </Select>

          <FormMessage />
         </FormItem>
        )}
       />}
    
      </div>

      <FormField
       control={methods.control}
       name="endDate"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Bitiş Tarihi</FormLabel>
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
