import CampaignCard from "../CampaignCard";
import React, { useEffect } from 'react'
import CategoryEmptyCampaigns from "./CategoryEmptyCampaigns";
import InfiniteScroll from "../InfiniteScroll";


export default function ({category, url, items}){

return(<section>
 
{items && items.length > 0 ? 
<InfiniteScroll type={"campaigns"} initialItems={items || []} url={url}  />
:
<CategoryEmptyCampaigns></CategoryEmptyCampaigns>
}
</section>
)

}