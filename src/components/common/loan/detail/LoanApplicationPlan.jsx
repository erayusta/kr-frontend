import { formatPrice } from '@/utils/loan';
import React from 'react';

export default function LoanApplicationPlan ({ data }) {
  let options = [];

  if (data.loanType === 'mortgage') {
    options = [
      { name: 'Faiz Oranı', value: `%${data.interest}` },
      { name: 'Toplam Faiz', value: formatPrice(data.totalInterest) },
      { name: 'Tahsis Ücreti', value: data.slug === 'enpara' ? '0 TL' : formatPrice(data.loanAmount * (0.57 / 100)) },
      { name: 'Aylık Taksit', value: formatPrice(data.monthlyInstallment) },
      { name: 'Toplam Ödeme', value: formatPrice(data.totalPayment) },
      { name: 'Yıllık Maliyet Oranı', value: '?' },
      { name: 'Ekspertiz Ücreti', value: formatPrice(data.expertiseFee) },
      { name: 'Taşınmaz Rehin Ücreti', value: formatPrice(data.mortgageFee) },
    ];
  } else if (data.loanType === 'newCar') {
    options = [
      { name: 'Faiz Oranı', value: `%${data.interest}` },
      { name: 'Toplam Faiz', value: formatPrice(data.totalInterest) },
      { name: 'Tahsis Ücreti', value: data.slug === 'enpara' ? '0 TL' : formatPrice(data.loanAmount * (0.57 / 100)) },
      { name: 'Aylık Taksit', value: formatPrice(data.monthlyInstallment) },
      { name: 'Toplam Ödeme', value: formatPrice(data.totalPayment) },
      { name: 'Yıllık Maliyet Oranı', value: '?' },
      { name: 'Rehin Ücreti', value: formatPrice(data.orignationFee) },
    ];
  } else {
    options = [
      { name: 'Faiz Oranı', value: `%${data.interest}` },
      { name: 'Toplam Faiz', value: formatPrice(data.totalInterest) },
      { name: 'Tahsis Ücreti', value: data.slug === 'enpara' ? '0 TL' : formatPrice(data.loanAmount * (0.57 / 100)) },
      { name: 'Aylık Taksit', value: formatPrice(data.monthlyInstallment) },
      { name: 'Toplam Ödeme', value: formatPrice(data.totalPayment) },
      { name: 'Yıllık Maliyet Oranı', value: '?' },
    ];
  }

  return (
<div className={`grid grid-cols-3 gap-5 ${data.loanType === 'mortgage' ? 'md:grid-cols-5' : data.loanType === 'newCar' ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
        {options.map((item, index) => (
          <ul key={index} className="flex flex-col items-start">
            <li className="flex flex-col items-start justify-between text-sm font-bold">{item.name}</li>
            <li className="py-1.5 text-sm font-medium rounded-full ">{item.value}</li>
          </ul>
        ))}
      </div>
  );
};
