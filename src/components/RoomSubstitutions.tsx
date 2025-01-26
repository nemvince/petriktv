import { useQuery } from '@tanstack/react-query';
import { REFETCH_INTERVALS } from '@/lib/constants';
import { Icon } from '@iconify/react/dist/iconify.js';
import Loading from '@c/Queries/Loading';
import QueryError from '@c/Queries/QueryError';
import { RoomSubstitution } from '@/schema/types';
import getRoomSubstitutions from '@/utils/getRoomSubstitutions';
import TableProvider from '@/contexts/TableContext';
import Table from '@c/DataTable/Table';

const RoomSubstitutions = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['roomSubstitution'],
		queryFn: getRoomSubstitutions,
		refetchInterval: REFETCH_INTERVALS.roomSubtitutions,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return (
		<TableProvider
			emptyMessage='Nincs teremcsere!'
			data={data as RoomSubstitution[]}
			headers={[
				{
					icon: (
						<Icon
							icon='mdi:clock'
							className='h-5 w-5'
						/>
					),
					headerKey: 'lesson',
				},
				{
					title: 'Honnan',
					headerKey: 'from',
				},
				{
					title: 'Hova',
					headerKey: 'to',
				},
				{
					title: 'Osztály',
					headerKey: 'className',
				},
			]}
		>
			<Table />
		</TableProvider>
	);
};

export default RoomSubstitutions;
