import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { REFETCH_INTERVALS } from '@/lib/constants';
import Loading from '@/components/Queries/Loading';
import QueryError from '@/components/Queries/QueryError';
import getBusDepartures from '@/utils/getBusDepartures';
import { Departure } from '@/schema/types';
import DepartureCard from '@/components/BusDeparture/DepartureCard';

const BusDeparture = ({ stopId, routeFilter, displayName }: Departure) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['busDeparture', stopId],
		retry() {
			return false;
		},
		queryFn: async () => await getBusDepartures(stopId, routeFilter),
		refetchInterval: REFETCH_INTERVALS.busDepartures,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	if (!data) {
		return (
			<div className='flex h-full items-center justify-center gap-3'>
				<Icon
					icon='mdi:alert'
					className='text-4xl text-red-500'
				/>
				<span>Nincs járat!</span>
			</div>
		);
	}

	return (
		<DepartureCard
			data={data}
			displayName={displayName}
		/>
	);
};

export default BusDeparture;
