import { IMAGE_BASE_URL } from '@/constants/site';
import React from 'react';

export default function ({data}) {
 
  return (
    <div className="mt-5 mb-5 overflow-x-auto shadow-md rounded-2xl">
      <table className="w-full text-sm text-center bg-white text-wrap md:text-md dark:bg-slate-900">
        <thead className="bg-gray-100 text-sky-950">
          <tr>
            <th scope="col" className="px-6 py-4 border-r-2">Banka</th>
            <th scope="col" className="px-6 py-4 border-r-2">Kredi Tutarı (Min-Max)</th>
            <th scope="col" className="px-6 py-4 border-r-2">Kredi Vade (Min-Max)</th>
            <th scope="col" className="px-6 py-4 border-r-2">Faiz Oranı (Min-Max)</th>
          </tr>
        </thead>
        <tbody>
          {data.filter(item => item.minAmount.min > 0).map((item, index) => (
            <tr key={index}>
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img
                  width="100"
                  src={item.logo}
                  alt={`${item.bankName} Logo`}
                  loading="lazy"
                  className=""
                />
              </th>
              <td className="px-6 py-4 text-center">{`${item.minAmount.min} - ${item.maxAmount.max} TL`}</td>
              <td className="px-6 py-4 text-center">{`${item.minMaturity.min} - ${item.maxMaturity.max} Ay`}</td>
              <td className="px-6 py-4 text-center">{`%${item.interestRate.min} - %${item.interestRate.max}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
