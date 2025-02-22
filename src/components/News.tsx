import { useQuery } from '@tanstack/react-query';
import Marquee from 'react-fast-marquee';
import Loading from '@/components/Queries/Loading';
import QueryError from '@/components/Queries/QueryError';
import { REFETCH_INTERVALS } from '@/lib/constants';
import getNews from '@/utils/getNews';

const News = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['news'],
		queryFn: getNews,
		refetchInterval: REFETCH_INTERVALS.news,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	if (!data || data.length === 0) return null;

	return <Marquee className='px-2 py-0.5'>{data[0].alert}</Marquee>;
};

export default News;
