import CampaignCard from "../CampaignCard";
import React from 'react'
import CategoryEmptyCampaigns from "./CategoryEmptyCampaigns";
import LoadMoreList from "../LoadMoreList";


export default function ({category, url, items}){

return(<section>
 
{items && items.length > 0 ? (
  <LoadMoreList type="campaigns" initialItems={items || []} url={url} pageSize={12} />
) : (
  <CategoryEmptyCampaigns />
)}
</section>
)

}
