import { useQuery } from '@tanstack/react-query';
import AutoPaginatedTable from './AutoPaginatedTable';
import { Icon } from '@iconify/react';
import { REFETCH_INTERVALS } from '../lib/constants';
import Loading from './Loading';
import QueryError from './QueryError';
import getSubstitutions from '../helpers/getSubstitutions';

const Substitutions = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['substitutions'],
		queryFn: getSubstitutions,
		refetchInterval: REFETCH_INTERVALS.substitutions,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return (
		<AutoPaginatedTable
			header={[
				{
					icon: <Icon icon='mdi:clock' />,
					addClasses: 'w-12',
					center: true,
					key: 'lesson',
				},
				{
					title: 'Tanár',
					icon: <Icon icon='mdi:account' />,
					key: 'teacher',
				},
				{
					title: 'Helyettes',
					icon: <Icon icon='mdi:account-group' />,
					key: 'missing',
				},
				{
					title: 'Osztály',
					icon: <Icon icon='mdi:school' />,
					key: 'className',
				},
				{
					title: 'Terem',
					icon: <Icon icon='mdi:location' />,
					key: 'classroom',
				},
				{
					title: 'ÖVH',
					addClasses: 'font-bold text-sm',
					key: 'consolidated',
					render: (value: boolean) =>
						value ? (
							<div className='flex items-center justify-center'>
								<Icon icon='mdi:check' />
							</div>
						) : (
							''
						),
				},
			]}
			emptyStateMessage='Nincs helyettesítés!'
			data={data || []}
			tableHeight={438}
			cycleInterval={5000}
		/>
	);
};

export default Substitutions;
