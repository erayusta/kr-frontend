import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IMAGE_BASE_URL } from '@/constants/site';
import { ChevronLeft, ChevronRight, Info, Shield, Fuel, Settings, Calendar, Gauge, Car } from 'lucide-react';

export default function CampaignCarType({ campaign }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  
  // car verisini kontrol et - item veya car olabilir
  const carData = campaign.car || campaign.item;
  
  if (!carData) return null;

  // Görsel URL'ini düzenle
  const getImageUrl = (image) => {
    if (!image) return 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800';
    return image.startsWith('http') ? image : `${IMAGE_BASE_URL}/cars/${image}`;
  };

  // Aktif görsel
  const activeImages = carData.colors && selectedColorIndex !== null && carData.colors[selectedColorIndex]?.image
    ? [carData.colors[selectedColorIndex].image]
    : carData.images || [];

  const activeImage = activeImages[activeImageIndex] || activeImages[0];

  // Fiyat formatlama
  const formatPrice = (price) => {
    if (!price) return "Fiyat bilgisi yok";
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
  };

  const latestPrice = carData.history_prices && carData.history_prices.length > 0
    ? carData.history_prices[carData.history_prices.length - 1].price
    : null;

  // Görsel navigasyon
  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % activeImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
  };

  return (
    <div className="w-full space-y-6">
      {/* Ana Görsel ve Bilgi Kartı */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol: Görsel Bölümü */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(activeImage)}
              alt={`${carData.brand} ${carData.model}`}
              className="w-full h-[400px] object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800';
              }}
            />
            
            {/* Görsel Navigasyon */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Görsel Sayacı */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {activeImageIndex + 1} / {activeImages.length}
            </div>
          </div>

          {/* Küçük Görsel Galerisi */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {activeImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover"
                />
              </button>
            ))}
          </div>

          {/* Renk Seçenekleri */}
          {carData.colors && carData.colors.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-3">Renk Seçenekleri</p>
              <div className="flex gap-2 flex-wrap">
                {carData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setActiveImageIndex(0);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                      selectedColorIndex === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.code }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sağ: Bilgi Kartı */}
        <div className="space-y-4">
          {/* Başlık ve Fiyat */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {carData.brand} {carData.model}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">17 Fiyat Kadar</Badge>
                    <Badge variant="outline">Otomatik</Badge>
                  </div>
                </div>
                
                {latestPrice && (
                  <div className="text-3xl font-bold text-orange-600">
                    {formatPrice(latestPrice)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Özellik Tablosu */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {carData.attributes && carData.attributes.slice(0, 8).map((attr, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">{attr.name}</span>
                    <span className="text-sm font-medium text-gray-900">{attr.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Euro NCAP Skorları */}
          {carData.euroncap && (
            <Card className="bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-yellow-600" />
                  <h3 className="font-semibold">Euro NCAP Güvenlik Skorları</h3>
                  <Badge variant="secondary" className="ml-auto">
                    {carData.euroncap.testYear || new Date().getFullYear()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Yetişkin Yolcu', value: carData.euroncap.activePassengerScore },
                    { label: 'Çocuk Yolcu', value: carData.euroncap.childPassengerScore },
                    { label: 'Yaya Güvenliği', value: carData.euroncap.pedestrianPassengerScore },
                    { label: 'Güvenlik Donanımı', value: carData.euroncap.securityEquipmentScore }
                  ].map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-amber-500">
                          {item.value || 0}%
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all"
                              style={{ width: `${item.value || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Fiyat Geçmişi */}
      {carData.history_prices && carData.history_prices.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Fiyat Analizi</h3>
            <div className="space-y-2">
              {carData.history_prices.map((price, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <span className="text-sm text-gray-600">
                    {new Date(price.date).toLocaleDateString('tr-TR', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="font-medium">{formatPrice(price.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}