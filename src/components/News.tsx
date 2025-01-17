import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Marquee from 'react-fast-marquee';
import Loading from './Loading';
import QueryError from './QueryError';
import { REFETCH_INTERVALS } from '../lib/constants';

const News = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['news'],
		queryFn: async () => {
			const response = await axios.get(
				'https://helyettesites.petrik.hu/api/',
				{
					params: {
						status: 'napihir',
					},
				},
			);

			if (response.status !== 200) {
				throw new Error('Network response was not ok');
			}

			// data might be plaintext, so we need to parse it
			if (typeof response.data === 'string') {
				return [];
			} else {
				return response.data;
			}
		},
		refetchInterval: REFETCH_INTERVALS.news,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return data.length > 0 ? (
		<Marquee className='px-2 py-0.5'>{data[0].alert}</Marquee>
	) : null;
};

export default News;
