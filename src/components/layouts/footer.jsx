
import Script from 'next/script';

const Footer = () => {
return (
    <>
      <footer className="bg-background shadow-md">
  <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
    <div className="sm:flex sm:items-center sm:justify-between">
     <img className="" src="https://kampanyaradar-static.b-cdn.net/kampanyaradar/general/Mlk7WBxx36Op0Ej.png" width={120} alt="KampanyaRadar Logo"></img>

      <ul className="mt-8 flex justify-start gap-6 sm:mt-0 sm:justify-end">
        <li>
          <a
            href="https://facebook.com/kampanyaradar"
            rel="noreferrer"
            target="_blank"
            className="text-gray-700 transition hover:opacity-75"
          >
            <span className="sr-only">Facebook</span>

            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>

        <li>
          <a
            href="https://www.instagram.com/kampanyaradar/"
            rel="noreferrer"
            target="_blank"
            className="text-gray-700 transition hover:opacity-75"
          >
            <span className="sr-only">Instagram</span>

            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </li>

        <li>
          <a
            href="https://x.com/kampanyaradar"
            rel="noreferrer"
            target="_blank"
            className="text-gray-700 transition hover:opacity-75"
          >
            <span className="sr-only">X</span>

            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6 bi bi-twitter-x" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
            </svg>
          </a>
        </li>

      </ul>
    </div>

    <div className="grid grid-cols-1 gap-8 border-t border-gray-100 pt-8 sm:grid-cols-2 lg:grid-cols-4 lg:pt-16">
  <div>
    <p className="font-medium text-gray-900">Kurumsal</p>
    <ul className="mt-6 space-y-4 text-sm">
      <li><a href="/hakkimizda" className="text-gray-700 transition hover:opacity-75">Hakkımızda</a></li>
      <li><a href="/blog" className="text-gray-700 transition hover:opacity-75">Blog</a></li>
    </ul>
  </div>

  <div>
    <p className="font-medium text-gray-900">Kredi Hesapla</p>
    <ul className="mt-6 space-y-4 text-sm">
      <li><a href="/kredi/ihtiyac-kredisi" className="text-gray-700 transition hover:opacity-75">İhtiyaç Kredisi Hesapla</a></li>
      <li><a href="/kredi/tasit-kredisi" className="text-gray-700 transition hover:opacity-75">Taşıt Kredisi Hesapla</a></li>
      <li><a href="/kredi/konut-kredisi" className="text-gray-700 transition hover:opacity-75">Konut Kredisi Hesapla</a></li>
    </ul>
  </div>

  <div>
    <p className="font-medium text-gray-900">Destek</p>
    <ul className="mt-6 space-y-4 text-sm">
      <li><a href="#" className="text-gray-700 transition hover:opacity-75">Kampanya Gönderme</a></li>
      <li><a href="#" className="text-gray-700 transition hover:opacity-75">Kampanyaya Katılma</a></li>
    </ul>
  </div>

  <div>
    <p className="font-medium text-gray-900">Legal</p>
    <ul className="mt-6 space-y-4 text-sm">
      <li><a href="/kullanici-sozlesmesi" className="text-gray-700 transition hover:opacity-75">Kullanıcı Sözleşmesi</a></li>
      <li><a href="/kvkk-uyumluluk" className="text-gray-700 transition hover:opacity-75">Kvkk Uyumluluk</a></li>
      <li><a href="/kisisel-veri-izni" className="text-gray-700 transition hover:opacity-75">Kişisel Veri İzni</a></li>
      <li><a href="/gizlilik-sozlesmesi" className="text-gray-700 transition hover:opacity-75">Gizlilik Sözleşmesi</a></li>
    </ul>
  </div>
</div>
    <p className="text-xs text-gray-500">&copy; 2021 KampanyaRadar Tüm Haklar Saklıdır.</p>
  </div>
</footer>
      <Script src="/akfix.js" strategy="afterInteractive" />
    </>
  )
}

export default Footer
