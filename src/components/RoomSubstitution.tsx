import { useQuery } from '@tanstack/react-query';
import { REFETCH_INTERVALS } from '../lib/constants';
import { Icon } from '@iconify/react/dist/iconify.js';
import Loading from './Loading';
import QueryError from './QueryError';
import AutoPaginatedTable from './AutoPaginatedTable';
import { RoomSubstitutionEntry } from '../schema/types';
import getRoomSubstitutions from '../helpers/getRoomSubstitutions';

const RoomSubstitution = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['roomSubstitution'],
		queryFn: getRoomSubstitutions,
		refetchInterval: REFETCH_INTERVALS.roomSubtitutions,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return (
		<AutoPaginatedTable
			data={data as RoomSubstitutionEntry[] | []}
			header={[
				{
					icon: <Icon icon='mdi:clock' />,
					addClasses: 'w-12',
					center: true,
					key: 'lesson',
				},
				{
					title: 'Honnan',
					key: 'from',
					center: false,
				},
				{
					title: 'Hova',
					key: 'to',
					center: false,
				},
				{
					title: 'Osztály',
					key: 'class',
				},
			]}
			emptyStateMessage='Nincs teremcsere!'
			cycleInterval={5000}
			tableHeight={197}
			headerHeight={10}
		/>
	);
};

export default RoomSubstitution;
