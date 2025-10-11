import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormInput, XIcon } from "lucide-react";
import MaskedInput from 'react-text-mask';
import apiRequest from '@/lib/apiRequest';
import { useToast } from '@/components/ui/use-toast';
import { isWebDevice } from '@/lib/utils';

const schema = yup.object().shape({
 phone: yup.string().required("Telefon numarası gerekli"),
 firstName: yup.string().required("İsim gerekli"),
 lastName: yup.string().required("Soyİsim gerekli"),
 email: yup.string().email('Geçersiz E-posta Adresi').required('Email Adresi Zorunlu'),
 consent: yup.bool().oneOf([true], "Onay gereklidir"),
});

const CustomMaskedInput = React.forwardRef(({ register, name, errors, ...rest }, ref) => {
 return (
  <MaskedInput
   ref={ref}
   mask={[
    '+', '9', '0', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/
   ]}
   className={`flex h-10 w-full rounded-md border ${errors[name] ? 'border-red-500' : 'border-gray-300'
    } bg-white px-3 py-2 text-sm ring-offset-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
   placeholder="+90 (___) ___-____"
   guide={false}
   id={name}
   {...register(name)}
   {...rest}
  />
 );
});

CustomMaskedInput.displayName = 'CustomMaskedInput';

const FormField = ({ data, register, control, errors }) => {
  // İl ve ilçe verisini hazırla
  const dealersByCity = React.useMemo(() => {
    const dealers = [
      { il: "Adana", ilce: "Yüreğir", yetkiliSatici: "Nissan Okar", dealerCode: "10001" },
      { il: "Adıyaman", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Podyum", dealerCode: "30508" },
      { il: "Afyonkarahisar", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Ağrı", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Aksaray", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Çelik", dealerCode: "30513" },
      { il: "Amasya", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Asal", dealerCode: "10026" },
      { il: "Ankara", ilce: "Ayaş", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Bala", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Beypazarı", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Çankaya", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Elmadağ", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Etimesgut", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Evren", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Gölbaşı", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Güdül", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Haymana", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Kalecik", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Mamak", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Nallıhan", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Polatlı", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Sincan", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Akyurt", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Altındağ", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Çamlıdere", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Çubuk", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Kazan", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Keçiören", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Kızılcahamam", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Pursaklar", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Ankara", ilce: "Şereflikoçhisar", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Ankara", ilce: "Yenimahalle", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Antalya", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Balaban", dealerCode: "30504" },
      { il: "Ardahan", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Artvin", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Aydın", ilce: "Buharkent", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Aydın", ilce: "Kuyucak", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Aydın", ilce: "Karacasu", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Aydın", ilce: "Nazilli", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Bozdoğan", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Yenipazar", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Sultanhisar", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Köşk", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Çine", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "Efeler", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "Karpuzlu", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "İncirliova", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "Koçarlı", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "Germencik", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Söke", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Aydın", ilce: "Didim", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Aydın", ilce: "Kuşadası", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Balıkesir", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Akoto", dealerCode: "30510" },
      { il: "Bartın", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yılmaz", dealerCode: "12288" },
      { il: "Batman", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Vurallar", dealerCode: "30505" },
      { il: "Bayburt", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Bilecik", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Teknik Oto", dealerCode: "30506" },
      { il: "Bingöl", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Karabulut", dealerCode: "30511" },
      { il: "Bitlis", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Berk", dealerCode: "12816" },
      { il: "Bolu", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Burdur", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Bursa", ilce: "Nilüfer", yetkiliSatici: "Nissan Sertepe", dealerCode: "10006" },
      { il: "Çanakkale", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Akoto", dealerCode: "30510" },
      { il: "Çankırı", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Çorum", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Asal", dealerCode: "10026" },
      { il: "Denizli", ilce: "Pamukkale", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Diyarbakır", ilce: "Bağlar", yetkiliSatici: "Nissan Vurallar", dealerCode: "30505" },
      { il: "Düzce", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yılmaz", dealerCode: "12288" },
      { il: "Edirne", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Atm", dealerCode: "12792" },
      { il: "Elazığ", ilce: "Merkez", yetkiliSatici: "Nissan Karabulut", dealerCode: "30511" },
      { il: "Erzincan", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Erzurum", ilce: "Yakutiye", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Eskişehir", ilce: "Sultandere", yetkiliSatici: "Nissan Teknik Oto", dealerCode: "30506" },
      { il: "Gaziantep", ilce: "Şehitkamil", yetkiliSatici: "Nissan Bzl", dealerCode: "30512" },
      { il: "Giresun", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Gümüşhane", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Hakkâri", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Berk", dealerCode: "12816" },
      { il: "Hatay", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Arslanoğlu", dealerCode: "12019" },
      { il: "Iğdır", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Isparta", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Balaban", dealerCode: "30504" },
      { il: "İstanbul", ilce: "Ataşehir", yetkiliSatici: "Nissan K.Tepretoğulları", dealerCode: "12822" },
      { il: "İstanbul", ilce: "Kadıköy", yetkiliSatici: "Nissan K.Tepretoğulları", dealerCode: "12822" },
      { il: "İstanbul", ilce: "Adalar", yetkiliSatici: "Nissan Bostancıoğlu", dealerCode: "10012" },
      { il: "İstanbul", ilce: "Kartal", yetkiliSatici: "Nissan Bostancıoğlu", dealerCode: "10012" },
      { il: "İstanbul", ilce: "Maltepe", yetkiliSatici: "Nissan Bostancıoğlu", dealerCode: "10012" },
      { il: "İstanbul", ilce: "Pendik", yetkiliSatici: "Nissan Bostancıoğlu", dealerCode: "10012" },
      { il: "İstanbul", ilce: "Tuzla", yetkiliSatici: "Nissan Bostancıoğlu", dealerCode: "10012" },
      { il: "İstanbul", ilce: "Beşiktaş", yetkiliSatici: "Nissan Gerçek", dealerCode: "30501" },
      { il: "İstanbul", ilce: "Beykoz", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "İstanbul", ilce: "Kağıthane", yetkiliSatici: "Nissan Gerçek", dealerCode: "30501" },
      { il: "İstanbul", ilce: "Şişli", yetkiliSatici: "Nissan Gerçek", dealerCode: "30501" },
      { il: "İstanbul", ilce: "Avcılar", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Beylikdüzü", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Büyükçekmece", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Çatalca", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Esenyurt", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Küçükçekmece", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Silivri", yetkiliSatici: "Nissan Görkem", dealerCode: "12320" },
      { il: "İstanbul", ilce: "Sarıyer", yetkiliSatici: "Nissan Gerçek", dealerCode: "10013" },
      { il: "İstanbul", ilce: "Ümraniye", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "İstanbul", ilce: "Üsküdar", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "İstanbul", ilce: "Arnavutköy", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Bağcılar", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Bahçelievler", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Bakırköy", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Başakşehir", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Esenler", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Güngören", yetkiliSatici: "Nissan Kuzey", dealerCode: "10014" },
      { il: "İstanbul", ilce: "Zeytinburnu", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Bayrampaşa", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Beyoğlu", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Eyüp", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Fatih", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Gaziosmanpaşa", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Sultangazi", yetkiliSatici: "Nissan Mar", dealerCode: "30503" },
      { il: "İstanbul", ilce: "Çekmeköy", yetkiliSatici: "Nissan Yüzbaşıoğlu", dealerCode: "10018" },
      { il: "İstanbul", ilce: "Sancaktepe", yetkiliSatici: "Nissan Yüzbaşıoğlu", dealerCode: "10018" },
      { il: "İstanbul", ilce: "Sultanbeyli", yetkiliSatici: "Nissan Yüzbaşıoğlu", dealerCode: "10018" },
      { il: "İstanbul", ilce: "Şile", yetkiliSatici: "Nissan Yüzbaşıoğlu", dealerCode: "10018" },
      { il: "İzmir", ilce: "Balçova", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Bayındır", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Beydağ", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Buca", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Çeşme", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Gaziemir", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Güzelbahçe", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Karabağlar", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Menderes", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Narlıdere", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Seferihisar", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Selçuk", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Tire", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Torbalı", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Urla", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "İzmir", ilce: "Aliağa", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Bayraklı", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Bergama", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Bornova", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Çiğli", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Dikili", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Foça", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Karaburun", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Karşıyaka", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Kemalpaşa", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Kınık", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Kiraz", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Konak", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Menemen", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "İzmir", ilce: "Ödemiş", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Kahramanmaraş", ilce: "Onikişubat", yetkiliSatici: "Nissan Podyum", dealerCode: "30508" },
      { il: "Karabük", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Efe", dealerCode: "30509" },
      { il: "Karaman", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Çelik", dealerCode: "30513" },
      { il: "Kars", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Cihan", dealerCode: "12807" },
      { il: "Kastamonu", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Asal", dealerCode: "10026" },
      { il: "Kayseri", ilce: "Melikgazi", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Kırıkkale", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Kırklareli", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Atm", dealerCode: "12792" },
      { il: "Kırşehir", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Otomol", dealerCode: "30514" },
      { il: "Kilis", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Bzl", dealerCode: "30512" },
      { il: "Kocaeli", ilce: "Kartepe", yetkiliSatici: "Nissan Yılmaz", dealerCode: "12288" },
      { il: "Konya", ilce: "Karatay", yetkiliSatici: "Nissan Çelik", dealerCode: "30513" },
      { il: "Kütahya", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Teknik Oto", dealerCode: "30506" },
      { il: "Malatya", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Karabulut", dealerCode: "30511" },
      { il: "Manisa", ilce: "Yunusemre", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Şehzadeler", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Saruhanlı", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Turgutlu", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Ahmetli", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Salihli", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Gölmarmara", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Akhisar", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Kırkağaç", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Soma", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Gördes", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Köprübaşı", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Demirci", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Selendi", yetkiliSatici: "Nissan Borovali", dealerCode: "30507" },
      { il: "Manisa", ilce: "Kula", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Alaşehir", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Manisa", ilce: "Sarıgöl", yetkiliSatici: "Nissan Artkiy", dealerCode: "12804" },
      { il: "Mardin", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Vurallar", dealerCode: "30505" },
      { il: "Mersin(Içel)", ilce: "Mezitli", yetkiliSatici: "Nissan Onuk", dealerCode: "10025" },
      { il: "Muğla", ilce: "Bodrum", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Milas", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Yatağan", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Kavaklıdere", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Menteşe", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Ula", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Marmaris", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Datça", yetkiliSatici: "Nissan Gülan", dealerCode: "10013" },
      { il: "Muğla", ilce: "Fethiye", yetkiliSatici: "Nissan Kocatepe", dealerCode: "11094" },
      { il: "Muğla", ilce: "Köyceğiz", yetkiliSatici: "Nissan Kocatepe", dealerCode: "11094" },
      { il: "Muğla", ilce: "Ortaca", yetkiliSatici: "Nissan Kocatepe", dealerCode: "11094" },
      { il: "Muğla", ilce: "Dalaman", yetkiliSatici: "Nissan Kocatepe", dealerCode: "11094" },
      { il: "Muğla", ilce: "Seydikemer", yetkiliSatici: "Nissan Kocatepe", dealerCode: "11094" },
      { il: "Muş", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Karabulut", dealerCode: "30511" },
      { il: "Nevşehir", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Niğde", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Ordu", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Osmaniye", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Okar", dealerCode: "10001" },
      { il: "Rize", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Sakarya", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yılmaz", dealerCode: "12288" },
      { il: "Samsun", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Asal", dealerCode: "10026" },
      { il: "Siirt", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Berk", dealerCode: "12816" },
      { il: "Sinop", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Asal", dealerCode: "10026" },
      { il: "Sivas", ilce: "Merkez", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Şanlıurfa", ilce: "Haliliye", yetkiliSatici: "Nissan Erik", dealerCode: "12805" },
      { il: "Şırnak", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Berk", dealerCode: "12816" },
      { il: "Tekirdağ", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Atm", dealerCode: "12792" },
      { il: "Tokat", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Trabzon", ilce: "Ortahisar", yetkiliSatici: "Nissan Beyazlı", dealerCode: "10028" },
      { il: "Tunceli", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Karabulut", dealerCode: "30511" },
      { il: "Uşak", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yavuzlar", dealerCode: "10008" },
      { il: "Van", ilce: "Edremit", yetkiliSatici: "Nissan Berk", dealerCode: "12816" },
      { il: "Yalova", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Sertepe", dealerCode: "10006" },
      { il: "Yozgat", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan İnoto", dealerCode: "12694" },
      { il: "Zonguldak", ilce: "Tüm ilçeler", yetkiliSatici: "Nissan Yılmaz", dealerCode: "12288" }
    ];
    
    // İllere göre gruplandır
    const cities = {};
    dealers.forEach(dealer => {
      if (!cities[dealer.il]) {
        cities[dealer.il] = [];
      }
      // Aynı il-ilçe kombinasyonu için tekrarları engelle
      const existingIndex = cities[dealer.il].findIndex(item => item.ilce === dealer.ilce);
      if (existingIndex === -1) {
        cities[dealer.il].push(dealer);
      }
    });

    // İl bazında veya ilçe bazında gösterim için düzenleme
    const processedCities = {};
    Object.entries(cities).forEach(([city, dealers]) => {
      processedCities[city] = dealers.sort((a, b) => a.ilce.localeCompare(b.ilce));
    });

    return processedCities;
  }, []);

  const RenderField = () => {
    if (data.name === 'bayi') {
      return (
        <div className="space-y-2">
          <Label htmlFor={data.name} className="text-xs">{data.label}</Label>
          <select
            id={data.name}
            {...register(data.name)}
            className={`flex h-10 w-full rounded-md border ${errors[data.name] ? 'border-red-500' : 'border-gray-300'} bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <option value="">Bayi Seçiniz</option>
            {Object.entries(dealersByCity).sort().map(([city, dealers]) => {
              const hasOnlyOneDealer = dealers.length === 1;
              
              if (hasOnlyOneDealer) {
                // Tek bayi varsa direkt şehir olarak göster
                return (
                  <option 
                    key={`${dealers[0].il}`} 
                    value={dealers[0].dealerCode}
                  >
                    {dealers[0].il}
                  </option>
                );
              } else {
                // Birden fazla bayi varsa ilçeleri grupla
                return (
                  <optgroup key={city} label={city}>
                    {dealers.map(dealer => (
                      <option 
                        key={`${dealer.il}-${dealer.ilce}`} 
                        value={dealer.dealerCode}
                      >
                        {dealer.ilce}
                      </option>
                    ))}
                  </optgroup>
                );
              }
            })}
          </select>
          {errors[data.name] && <p className="text-red-500 text-xs">{errors[data.name]?.message}</p>}
        </div>
      );
    } else if (data.type === 'text') {
      if (data.name === 'phone') {
        return (
          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required', pattern: { value: /^\+90 \([1-9]\d{2}\) \d{3}-\d{4}$/, message: 'Invalid phone number' } }}
            render={({ field }) => (
              <CustomMaskedInput
                register={register}
                name="phone"
                errors={errors}
                {...field}
              />
            )}
          />
        );
      }
      return (
        <div className="space-y-2">
          <Label htmlFor={data.name} className="text-xs">{data.label}</Label>
          <Input
            id={data.name}
            {...register(data.name)}
            placeholder=""
            className={`${errors[data.name] ? 'border-red-500' : ''}`}
          />
          {errors[data.name] && <p className="text-red-500 text-xs">{errors[data.name]?.message}</p>}
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <Checkbox className="mr-2" id={data.name} {...register(data.name)} />
          <Label htmlFor={data.name} className="text-xs" dangerouslySetInnerHTML={{ __html: data.label }}></Label>
          {errors[data.name] && <p className="text-red-500 text-xs">{errors[data.name]?.message}</p>}
        </div>
      );
    }
  };

  return <RenderField />;
};

export default function CampaignForm({ form, campaignId }) {
 const [isOpen, setIsOpen] = useState(isWebDevice());
 const { toast } = useToast()
 const { register, handleSubmit, control, formState: { errors } } = useForm({
  resolver: yupResolver(schema),
 });

 const onSubmit = async (data) => {
  try {
    // Form verilerini backend'in beklediği formata dönüştür
    const payload = {
      campaign_id: campaignId,
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.name || 'İsimsiz',
      email: data.email || '',
      phone: data.phone || '',
      form_data: data // Tüm form verilerini sakla
    };
    
    const response = await apiRequest('/leads', 'post', payload);
    
    toast({
      title: 'Başarılı!',
      description: 'Form başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.'
    });
    
    // Formu kapat
    setTimeout(() => {
      toggleForm();
    }, 2000);
    
  } catch (error) {
    console.error("Form gönderimi başarısız:", error);
    toast({
      title: 'Hata!',
      description: error.response?.data?.message || error.message || 'Form gönderilemedi, lütfen tekrar deneyin.',
      variant: 'destructive'
    });
  }
};


 const toggleForm = () => {
  setIsOpen(!isOpen);
 };

 return (
  <>
   {!isOpen && <button className="fixed animate-bounce bottom-4 right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center z-50" onClick={toggleForm}>
    <FormInput className="h-6 w-6" />
   </button>}
   <div className={`fixed shadow-xl bottom-0 right-0 w-full md:max-w-xs p-3 bg-white rounded-t-lg  transition-transform transform ${isOpen ? 'translate-y-0' : 'translate-y-full'}  z-40`}>
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-2">
      <FormInput className="h-6 w-6" />
      <div className="text-md md:text-sm font-semibold">{form.description}</div>
     </div>
     <Button size="icon" variant="ghost" onClick={toggleForm}>
      <XIcon className="h-5 w-5" />
      <span className="sr-only">Close</span>
     </Button>
    </div>
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
     {form.fields.map(field => (
      <FormField key={field.name} data={field} register={register} control={control} errors={errors} />
     ))}
     <Button 
      className="w-full bg-orange-500 hover:bg-orange-600 font-medium" 
      style={{ color: 'white' }}
      type="submit"
     >
      {form.buttonText || 'Kampanyayı Yakala'}
     </Button>
    </form>
   </div>
  </>
 );
}
