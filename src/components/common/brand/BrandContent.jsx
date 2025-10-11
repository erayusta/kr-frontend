import React from 'react'
import BrandEmptyCampaigns from "./BrandEmptyCampaigns";
import InfiniteScroll from "../InfiniteScroll";

export default function ({brand, url, items}){

return(<section>
{items && items.length > 0 ?
 <InfiniteScroll type={"campaigns"} initialItems={items || []} url={url}  />
:
<BrandEmptyCampaigns></BrandEmptyCampaigns>
}
</section>
)

}