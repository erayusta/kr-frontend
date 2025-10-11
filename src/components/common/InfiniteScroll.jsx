import apiRequest, { fetchData } from '@/lib/apiRequest';
import { useState, useEffect, useRef } from 'react';
import CampaignCard from './CampaignCard';
import { Skeleton } from '../ui/skeleton';
import { LoaderIcon } from 'lucide-react';
import { Card, CardTitle } from '../ui/card';
import PostCard from './PostCard';

const InfiniteScroll = ({ initialItems, url, type }) => {
  const [items, setItems] = useState(initialItems || []);
  const [page, setPage] = useState(2); 
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(`${url}&page=${page}&limit=10`, 'get')
        // Handle different response formats
        // For categories: response.campaigns
        // For posts: response.data
        const newItems = response?.campaigns || response?.data || response?.items || [];
        
        // Ensure newItems is an array
        if (Array.isArray(newItems)) {
          setItems((prevItems) => [...prevItems, ...newItems]);
        } else {
          console.error('InfiniteScroll: newItems is not an array:', newItems);
        }
      } catch (error) {
        console.error('Failed to load more items:', error);
      }
      setLoading(false);
    };

    if (page > 1) {  
      loadItems();
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, []);

  return (
    <div>
     <div className='grid grid-cols-auto gap-5 md:grid-cols-4 '>
     {items && items.length > 0 && items.map((item, index) => 
     {
      switch(type){
       case 'campaigns':
        return ( <CampaignCard key={item.id || index} {...item}></CampaignCard>)
        case 'posts':
          return ( <PostCard key={item.id || index} {...item}></PostCard>)
        default:
          return null
      }
     } )}
     </div>
         {loading && <div className="flex mt-10 mb-10  gap-x-5 items-center justify-center">
          <LoaderIcon className="animate-spin" />
          <CardTitle className="text-md"> Daha Fazla Yükleniyor...</CardTitle>
          </div>}
     
      <div ref={loader} />
    </div>
  );
};

export default InfiniteScroll;
