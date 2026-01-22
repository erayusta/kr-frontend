import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock12Icon, HeartIcon, Share2Icon } from "lucide-react";
import { getIcon } from "@/lib/utils";
import { useFavorite } from "@/hooks/useFavorite";
import { remainingDay } from "@/utils/campaign";

export default function CampaignHeader({ campaign }) {
  const remainingDays = remainingDay(campaign.end_date || campaign.endDate);
  const favoriteId = campaign?.id ?? campaign?._id ?? campaign?.slug;
  const { isFavorite, toggle, canToggle } = useFavorite("campaign", favoriteId);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(campaign.title)}&url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/kampanya/${campaign.slug}`)}`;

  return (
    <section className="w-full bg-background py-3">
      <div className="xl:mx-auto xl:px-36">
        <div className="container px-4 py-2">
          <div className="flex gap-x-3 items-center justify-between">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                {campaign.brands?.[0] && (
                  <Link href={`/marka/${campaign.brands[0].slug}`}>
                    <span className="inline-block rounded-md bg-muted text-muted-foreground hover:shadow px-3 py-1 text-sm font-medium">
                      <Image src={campaign.brands[0].logo} alt={campaign.brands[0].name} width={96} height={32} className="h-8 w-auto object-contain" />
                    </span>
                  </Link>
                )}
                <h1 className="md:text-3xl text-xl max-w-[60ch] font-bold tracking-tight text-foreground">{campaign.title}</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button size="sm" variant="secondary" className="bg-accent text-accent-foreground">
                  <Clock12Icon className="mr-2 h-4 w-4" />
                  {remainingDays < 0 ? "Süresi Doldu" : `${remainingDays} Gün Kaldı`}
                </Button>
                {Array.isArray(campaign.categories) && campaign.categories.length > 0 && (
                  <div className="text-sm items-center flex flex-wrap gap-2 text-muted-foreground">
                    {campaign.categories.map((cat, idx) => (
                      <Button key={cat.slug || idx} asChild size="sm" variant="secondary" className="items-center flex gap-2 bg-accent text-accent-foreground">
                        <Link href={`/kategori/${cat.slug}`}>
                          <span className="text-md" dangerouslySetInnerHTML={{ __html: getIcon(cat.name) }} />
                          <span>{cat.name?.length > 20 ? `${cat.name.slice(0, 10)}...` : cat.name}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex md:flex-row flex-col items-center gap-3">
              <Button
                disabled={!canToggle}
                onClick={toggle}
                variant="outline"
                className={`rounded-full py-3 ${
                  isFavorite
                    ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                    : "hover:border-primary hover:text-primary"
                }`}
              >
                <HeartIcon className="mr-2 h-5 w-5" /> <span className="md:block hidden">Kaydet</span>
              </Button>
              <Button asChild variant="outline" className="rounded-full py-3 hover:border-primary hover:text-primary">
                <a target="_blank" rel="noopener noreferrer" href={tweetUrl}>
                  <Share2Icon className="mr-2 h-5 w-5" />
                  <span className="md:block hidden">Paylaş</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
