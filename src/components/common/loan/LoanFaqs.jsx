import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"



export default function LoanFaqs({faqs}){
 return(<Accordion type="single" collapsible>
 {faqs.map((faq,index) => <AccordionItem value={index+1}>
    <AccordionTrigger>{faq.question}</AccordionTrigger>
    <AccordionContent>
    {faq.answer}
    </AccordionContent>
  </AccordionItem>)}
</Accordion>
)
}