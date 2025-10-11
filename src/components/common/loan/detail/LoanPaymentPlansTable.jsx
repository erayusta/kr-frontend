import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPrice } from "@/utils/loan";

 

export function LoanPaymentPlansTable({paymentPlans}) {
  return (
   <div className="w-full overflow-x-auto">
 <Table className="">
      <TableCaption>Ödeme Planlarınızın Listesi.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Ay</TableHead>
          <TableHead>Taksit</TableHead>
          <TableHead>Ana Para</TableHead>
          <TableHead>Faiz</TableHead>
          <TableHead>KKDF</TableHead>
          <TableHead>BSMV</TableHead>
          <TableHead>Bakiye</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentPlans.map((item) => (
          <TableRow key={item.period}>
            <TableCell className="font-medium">{item.period}</TableCell>
            <TableCell>{formatPrice(item.installmentAmount)}</TableCell>
            <TableCell>{formatPrice(item.principal)}</TableCell>
            <TableCell>{formatPrice(item.interest)}</TableCell>
            <TableCell>{formatPrice(item.kkdf)}</TableCell>
            <TableCell>{formatPrice(item.bsmv)}</TableCell>
            <TableCell>{formatPrice(item.remainingPrincipal)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={6}>Toplam</TableCell>
          <TableCell className="text-right">
            {formatPrice(paymentPlans.reduce((acc, item) => acc + item.installmentAmount, 0))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
   </div>
   
  );
}
