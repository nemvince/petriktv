import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { REFETCH_INTERVALS } from '@/lib/constants';
import Loading from '@c/Queries/Loading';
import QueryError from '@c/Queries/QueryError';
import getSubstitutions from '@/utils/getSubstitutions';
import { Substitution } from '@/schema/types';
import TableProvider from '@/contexts/TableContext';
import Table from './DataTable/Table';

const Substitutions = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['substitutions'],
		queryFn: getSubstitutions,
		refetchInterval: REFETCH_INTERVALS.substitutions,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return (
		<TableProvider
			emptyMessage='Nincs helyettesítés!'
			data={data as Substitution[]}
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
					title: 'Tanár',
					icon: <Icon icon='mdi:account' />,
					headerKey: 'teacher',
				},
				{
					title: 'Helyettes',
					icon: <Icon icon='mdi:account-group' />,
					headerKey: 'missing',
				},
				{
					title: 'Osztály',
					icon: <Icon icon='mdi:school' />,
					headerKey: 'className',
				},
				{
					title: 'Terem',
					icon: <Icon icon='mdi:location' />,
					headerKey: 'classroom',
				},
				{
					title: 'ÖVH',
					headerKey: 'consolidated',
					render: (value: boolean) =>
						value ? (
							<Icon
								icon='mdi:check'
								className='h-[1.5em] w-[1.5em]'
							/>
						) : (
							<Icon
								icon='mdi:close'
								className='h-[1.5em] w-[1.5em]'
							/>
						),
				},
			]}
		>
			<Table />
		</TableProvider>
	);
};

export default Substitutions;
