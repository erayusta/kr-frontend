import Head from 'next/head';
import Link from 'next/link';
import { Timer, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layouts/layout';
import CampaignCard from '@/components/common/CampaignCard';
import serverApiRequest from '@/lib/serverApiRequest';
import { remainingDay } from '@/utils/campaign';

export async function getServerSideProps() {
  try {
    const data = await serverApiRequest('/campaigns/expiring-soon', 'get');
    return { props: { campaigns: data.data || [] } };
  } catch {
    return { props: { campaigns: [] } };
  }
}

function ExpiryBadge({ endDate }) {
  if (!endDate) return null;
  const days = remainingDay(endDate);
  if (days < 0) return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Sona Erdi</span>;
  if (days === 0) return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">Bugün bitiyor!</span>;
  if (days === 1) return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">Yarın bitiyor</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{days} gün kaldı</span>;
}

export default function BugunBitiyorPage({ campaigns }) {
  const today = campaigns.filter((c) => remainingDay(c.endDate) === 0);
  const tomorrow = campaigns.filter((c) => remainingDay(c.endDate) === 1);
  const later = campaigns.filter((c) => remainingDay(c.endDate) > 1);

  return (
    <Layout>
      <Head>
        <title>Bugün Bitiyor - KampanyaRadar</title>
        <meta name="description" content="Son günleri olan kampanyalar. Kaçırmadan katılın!" />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white">
        <div className="container px-4 md:px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="h-7 w-7" />
            <h1 className="text-2xl md:text-3xl font-bold">Bugün Bitiyor</h1>
          </div>
          <p className="text-red-100 text-sm md:text-base max-w-lg">
            Son 3 gün içinde sona erecek kampanyalar. Kaçırmayın!
          </p>
          <nav className="flex items-center gap-1.5 text-sm text-red-200 mt-4">
            <Link href="/" className="hover:text-white transition-colors">KampanyaRadar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-red-300" />
            <Link href="/kampanyalar" className="hover:text-white transition-colors">Kampanyalar</Link>
            <ChevronRight className="h-3.5 w-3.5 text-red-300" />
            <span className="text-white font-medium">Bugün Bitiyor</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 px-4 md:px-6">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Timer className="h-14 w-14 text-gray-200 mb-4" strokeWidth={1} />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Yakında biten kampanya yok</h2>
            <p className="text-sm text-gray-500 mb-6">Şu anda 3 gün içinde bitecek kampanya bulunmuyor.</p>
            <Link href="/kampanyalar" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Tüm Kampanyalar
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Today */}
            {today.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-base font-bold text-red-600">Bugün Bitiyor ({today.length})</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {today.map((campaign) => (
                    <div key={campaign.slug} className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <ExpiryBadge endDate={campaign.endDate} />
                      </div>
                      <CampaignCard
                        id={campaign.id}
                        slug={campaign.slug}
                        title={campaign.title}
                        image={campaign.image}
                        brands={campaign.brands}
                        endDate={campaign.endDate}
                        end_date={campaign.endDate}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tomorrow */}
            {tomorrow.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <h2 className="text-base font-bold text-orange-600">Yarın Bitiyor ({tomorrow.length})</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {tomorrow.map((campaign) => (
                    <div key={campaign.slug} className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <ExpiryBadge endDate={campaign.endDate} />
                      </div>
                      <CampaignCard
                        id={campaign.id}
                        slug={campaign.slug}
                        title={campaign.title}
                        image={campaign.image}
                        brands={campaign.brands}
                        endDate={campaign.endDate}
                        end_date={campaign.endDate}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2-3 days */}
            {later.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <h2 className="text-base font-bold text-amber-700">Bu Hafta Bitiyor ({later.length})</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {later.map((campaign) => (
                    <div key={campaign.slug} className="relative">
                      <div className="absolute top-2 left-2 z-10">
                        <ExpiryBadge endDate={campaign.endDate} />
                      </div>
                      <CampaignCard
                        id={campaign.id}
                        slug={campaign.slug}
                        title={campaign.title}
                        image={campaign.image}
                        brands={campaign.brands}
                        endDate={campaign.endDate}
                        end_date={campaign.endDate}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
