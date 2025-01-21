import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { REFETCH_INTERVALS } from '../../lib/constants';
import Loading from '../Queries/Loading';
import QueryError from '../Queries/QueryError';
import DepartureCard from './DepartureCard';
import getBusDepartures from '../../utils/getBusDepartures';

interface BusDepartureProps {
	stopId: string | string[];
	routeFilter?: (string | null)[];
	displayName: string;
}
const BusDeparture = ({
	stopId,
	routeFilter,
	displayName,
}: BusDepartureProps) => {
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
