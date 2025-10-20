import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Heart, Share2, Calendar, Tag, ChevronRight } from "lucide-react";
import { remainingDay } from "@/utils/campaign";
import Link from "next/link";
import { IMAGE_BASE_URL } from '@/constants/site';

export default function CampaignHeader({ campaign }) {
  // Görsel URL'ini düzenle
  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800';
    if (image.startsWith('http')) return image;
    return `${IMAGE_BASE_URL}/${image}`;
  };

  const remainingDays = remainingDay(campaign.end_date || campaign.endDate);
  const isExpired = remainingDays < 0;

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="border-b bg-white">
        <div className="container px-4 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-gray-600 hover:text-gray-900">
                  Anasayfa
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              {campaign.categories && campaign.categories[0] && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink 
                      href={`/kategori/${campaign.categories[0].slug}`}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      {campaign.categories[0].name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4" />
                  </BreadcrumbSeparator>
                </>
              )}
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-medium">
                  {campaign.title.length > 40 ? campaign.title.substring(0, 40) + '...' : campaign.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Ana Header */}
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sol Taraf - Kampanya Bilgileri */}
          <div className="lg:col-span-8 space-y-6">
            {/* Marka ve Kategori */}
            <div className="flex flex-wrap items-center gap-3">
              {campaign.brands && campaign.brands[0] && (
                <Link href={`/marka/${campaign.brands[0].slug}`}>
                  <Card className="px-4 py-2 hover:shadow-md transition-shadow cursor-pointer bg-white">
                    <img
                      className="h-10 object-contain"
                      src={campaign.brands[0].logo}
                      alt={campaign.brands[0].name}
                    />
                  </Card>
                </Link>
              )}
              
              {campaign.categories && campaign.categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  <Tag className="h-3 w-3 mr-1.5" />
                  {category.name}
                </Badge>
              ))}
            </div>

            {/* Başlık */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {campaign.title}
              </h1>
            </div>

            {/* Süre ve Paylaşım */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Süre Bilgisi */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                isExpired 
                  ? 'bg-red-100 text-red-700' 
                  : remainingDays <= 7 
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
              }`}>
                <Clock className="h-4 w-4" />
                <span className="font-medium text-sm">
                  {isExpired 
                    ? 'Kampanya Sona Erdi' 
                    : remainingDays === 0 
                      ? 'Son Gün!' 
                      : `${remainingDays} Gün Kaldı`
                  }
                </span>
              </div>

              {/* Tarih Aralığı */}
              {(campaign.start_date || campaign.end_date) && (
                <div className="inline-flex items-center gap-2 text-gray-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {campaign.start_date && new Date(campaign.start_date).toLocaleDateString('tr-TR', { 
                      day: 'numeric',
                      month: 'long'
                    })}
                    {' - '}
                    {campaign.end_date && new Date(campaign.end_date).toLocaleDateString('tr-TR', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full hover:bg-gray-50"
                disabled
              >
                <Heart className="h-5 w-5 mr-2" />
                Kaydet
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-full hover:bg-gray-50"
                asChild
              >
                <Link 
                  target="_blank" 
                  href={`https://twitter.com/intent/tweet?text=${campaign.title}&url=${process.env.NEXT_PUBLIC_BASE_URL}/kampanya/${campaign.slug}`}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Paylaş
                </Link>
              </Button>
            </div>
          </div>

          {/* Sağ Taraf - Kampanya Görseli */}
          <div className="lg:col-span-4">
            <Card className="overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-0">
              <div className="relative aspect-[4/3]">
                <img
                  src={getImageUrl(campaign.image)}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800';
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Campaign Type Badge */}
                {campaign.item_type && (
                  <Badge 
                    className="absolute top-4 right-4 bg-white/90 text-gray-900 backdrop-blur-sm"
                  >
                    {campaign.item_type === 'product' && 'Ürün Kampanyası'}
                    {campaign.item_type === 'car' && 'Otomotiv Kampanyası'}
                    {campaign.item_type === 'real_estate' && 'Gayrimenkul Kampanyası'}
                    {!['product', 'car', 'real_estate'].includes(campaign.item_type) && 'Kampanya'}
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}