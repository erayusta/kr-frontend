
const InfoBox = ({ title, image }) => {
  return (
    <div className="justify-center p-4 pb-0 text-center bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="px-5 pb-5 mt-10">
        
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        
      </div>
      <img className="border-2 border-gray-200 rounded-tl-lg rounded-tr-lg" src={image} alt={title} />
    </div>
  );
};

export default function (){
   return (
    <div className="grid grid-cols-1 gap-8 p-5 mt-10 mb-10 md:p-0 md:grid-cols-3">
      <InfoBox
        title="Formu Doldur, Kampanyalardan Haberdar Ol"
        image="/sample-info.png"
      />
      <InfoBox
        title="Siz Arayalım, İndirim kampanyaları hakkında sormak istediğin sorular mı var?"
        image="/radar-info.png"
      />
      <InfoBox
        title="Bültene Abone Ol, sana özel filtrelenmiş kampanyaları ve indirimleri kaçırma."
        image="/subscribe-info.png"
      />
    </div>
  );
}