
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DialogTrigger, DialogContent, Dialog } from "@/components/ui/dialog";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CampaignSearch() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Merhaba! Ben KampanyaRadar'ın kampanya bulma asistanı yapay zekasıyım. Size en uygun kampanyaları bulmak için buradayım. Hangi tür ürünler veya hizmetler için kampanya aradığınızı bana söyleyebilirsiniz, ve size en iyi fırsatları sunarım. Hangi konuda yardımcı olabilirim?"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    // Kullanıcı mesajını ekle
    setMessages([...messages, { type: "user", content: userMessage }]);
    setInputValue('');
    setLoading(true);

    // Fake API çağrısı simülasyonu
    const response = await fakeApiCall(userMessage);

    // Bot mesajını ekle
    setMessages(prevMessages => [...prevMessages, { type: "bot", content: response }]);
    setLoading(false);
  };

  const fakeApiCall = (message) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (message.toLowerCase().includes("garanti bankası kampanyaları")) {
          resolve(`İşte Senin İçin Bulduğum güncel Garanti BBVA kampanyaları: ...<ul class="list-disc pl-4 space-y-1 mt-2"><li class=""><h2 class="text-sm font-semibold mb-2">Emekli Promosyon Kampanyası</h2><p class="mb-2">Emekli maaşını Garanti BBVA'ya taşıyan müşteriler, 15.000 TL'ye varan nakit promosyon kazanabilirler. Kampanya 1 Mayıs - 31 Mayıs 2024 tarihleri arasında geçerlidir. Ayrıca, EYT kapsamında prim borcu olanlar avantajlı faizlerle EYT Prim Borcu Kredisi kullanabilirler.</p></li><li class=""><h2 class="text-sm font-semibold mb-2">Yakınını Davet Et Kampanyası</h2><p class="mb-2">Mevcut müşteriler, yakınlarını Garanti BBVA'ya davet ederek toplamda 3.300 TL'ye kadar bonus kazanabilirler. Davet eden kişi her yeni müşteri için 300 TL bonus alır ve 10 kişiye kadar davet edebilir.</p></li><li class=""><h2 class="text-sm font-semibold mb-2">3000 TL Bonus Kampanyası</h2><p class="mb-2">Mayıs ayı boyunca dijital kanallardan müşteri olan ve bonus kredi kartı başvurusu yapan kişiler, belirli alışveriş hedeflerini tamamlayarak 3000 TL'ye varan bonus kazanabilirler. Kampanya 1 Mayıs - 31 Mayıs 2024 tarihleri arasında geçerlidir.</p></li><li class=""><h2 class="text-sm font-semibold mb-2">Faizsiz Kredi Kampanyası</h2><p class="mb-2">26 Nisan - 15 Mayıs 2024 tarihleri arasında ilk defa Garanti BBVA müşterisi olanlar, 20.000 TL'ye kadar faizsiz kredi kullanabilirler. Kampanya, mobil ve internet üzerinden yapılan başvurular için geçerlidir.</p></li><li class=""><h2 class="text-sm font-semibold mb-2">Faizsiz Taksitli Nakit Avans Kampanyası</h2><p class="mb-2">16 Mayıs - 31 Mayıs 2024 tarihleri arasında Garanti BBVA mobil uygulaması üzerinden müşteri olup kredi kartı başvurusu onaylanan kişiler, 20.000 TL'ye varan faizsiz ve masrafsız taksitli nakit avans kullanabilirler.</p></li></ul>
          `);
        } else if(message.toLowerCase().includes('bim')) {

resolve(`
BİM'in 24 Mayıs 2024 aktüel ürünler kataloğunda birçok cazip ürün ve indirim fırsatı bulunuyor. İşte bazı öne çıkan ürünler:
<ul class="list-disc pl-4 space-y-1">
  <li class="text-sm">Erinöz Rimini 5 Parça Oturma Grubu: 9.999 TL</li>
  <li class="text-sm">Erinöz Luka 3 Kişilik Gölgelikli Salıncak: 7.999 TL</li>
  <li class="text-sm">Katlanır Şezlong/Sandalye: 999 TL</li>
  <li class="text-sm">Bahçe Plaj Şemsiyesi: 599 TL</li>
  <li class="text-sm">5 Kişilik İntex Excursion Şişme Bot: 6.999 TL</li>
  <li class="text-sm">4 Kişilik İntex Seahawk Şişme Bot: 5.499 TL</li>
  <li class="text-sm">Universal Badminton Seti: 127,50 TL</li>
  <li class="text-sm">Universal Beach Raket Seti: 89 TL</li>
  <li class="text-sm">Universal Pinpon Masa Tenisi Seti: 89 TL</li>
  <li class="text-sm">Chef’s Tava: 139 TL</li>
  <li class="text-sm">Chef’s Krep Tava: 169 TL</li>
  <li class="text-sm">Stormax Organizer Kutu: 179 TL</li>
  <li class="text-sm">Pasta Börek Kabı: 109 TL</li>
  <li class="text-sm">Sızdırmaz Saklama Kabı: 21,50 TL</li>
  <li class="text-sm">Erkek Deniz Şortu: 109 TL</li>
  <li class="text-sm">Kadın Şort Mayo: 139 TL</li>
  <li class="text-sm">Çocuk Deniz Şortu: 99 TL</li>
  <li class="text-sm">Kız Çocuk Mayo: 99 TL</li>
  <li class="text-sm">Kadın-Erkek Hasır Görünümlü Şapka: 129 TL</li>
  <li class="text-sm">Kadın-Erkek Kep Şapka: 75 TL</li>
  <li class="text-sm">Kadın-Erkek Bermuda Şapka: 75 TL</li>
  <li class="text-sm">Range Türk Kahve Makinesi: 899 TL</li>
</ul>
`)

        }else{
          resolve("Bu konuda size yardımcı olabilmem için daha fazla bilgi verebilir misiniz?");
        }
      }, 4000);
    });
  };

  return (
    <div className="w-auto flex items-center gap-4">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative w-[40%]">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              className="w-full bg-background shadow-none appearance-none pl-8 dark:bg-gray-950"
              placeholder="Kampanya Bul"
              type="search"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="p-0">
          <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
            <div className="flex h-12 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
              <div className="flex items-center space-x-2">
                <BotIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                <h3 className="text-sm font-medium">KampanyaRadar Asistan AI</h3>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col space-y-4"
                >
                  {message.type === "bot" && (
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[75%] rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                  <div dangerouslySetInnerHTML={{__html:message.content}}></div>
                      </div>
                    </div>
                  )}
                  {message.type === "user" && (
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-lg bg-gray-900 p-3 text-sm text-gray-50 dark:bg-gray-50 dark:text-gray-900">
                        <p>{message.content}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="max-w-[75%] rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                    <Skeleton />
                  </div>
                </motion.div>
              )}
            </div>
            <div className="flex items-center border-t border-gray-200 px-4 py-3 dark:border-gray-800">
              <Input
                className="flex-1 pr-2"
                placeholder="Birşeyler Yaz..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button type="submit" onClick={handleSendMessage}>
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  )
}

function BotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  )
}

function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}
