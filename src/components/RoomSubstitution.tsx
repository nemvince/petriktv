import { useQuery } from '@tanstack/react-query';
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
} from '@tanstack/react-table';
import { REFETCH_INTERVALS, TABLE } from '@/lib/constants';
import { Icon } from '@iconify/react';
import Loading from '@/components/Queries/Loading';
import QueryError from '@/components/Queries/QueryError';
import AnimatedPlaceholder from '@/components/AnimatedPlaceholder';
import usePageCycler from '@/hooks/usePageCycler';
import type { RoomSubstitutionEntry } from '@/schema/types';
import getRoomSubstitutions from '@/utils/getRoomSubstitutions';

const columns: ColumnDef<RoomSubstitutionEntry>[] = [
	{
		accessorKey: 'lesson',
		header: () => <Icon icon='mdi:clock' />,
	},
	{
		accessorKey: 'from',
		header: () => (
			<>
				<Icon icon='mdi:location-enter' />
				Honnan
			</>
		),
	},
	{
		accessorKey: 'to',
		header: () => (
			<>
				<Icon icon='mdi:location-exit' />
				Hova
			</>
		),
	},
	{
		accessorKey: 'class',
		header: () => (
			<>
				<Icon icon='mdi:school' />
				Osztály
			</>
		),
	},
];

const RoomSubstitution = () => {
	const { data, isLoading, error } = useQuery({
		initialData: [],
		queryKey: ['roomSubstitution'],
		queryFn: getRoomSubstitutions,
		refetchInterval: REFETCH_INTERVALS.roomSubtitutions,
	});

	const pageSize = TABLE.roomSubstitutions.pageSize;

	const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

	const { currentPageIndex } = usePageCycler({
		totalPages,
		cycleInterval: TABLE.cycleInterval,
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			pagination: {
				pageIndex: currentPageIndex,
				pageSize,
			},
		},
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	if (data.length === 0) {
		return (
			<div className='flex h-full w-full flex-col items-center justify-center'>
				<AnimatedPlaceholder title='Nincs teremcsere!' />
			</div>
		);
	}

	return (
		<div className='flex h-full max-h-full max-w-full flex-col rounded-lg'>
			<div className='grow'>
				<table className='h-full w-full'>
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr
								key={headerGroup.id}
								className='border-petrik-3 border-b'
							>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={`border-petrik-3 p-2 font-semibold [&:not(:first-child)]:border-l ${header.id === 'lesson' ? 'w-12 text-center' : 'text-left'}`}
									>
										<div className='flex items-center justify-center gap-1 text-nowrap'>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</div>
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody className='table-auto'>
						{table.getRowModel().rows.map((row, index) => (
							<tr
								key={row.id}
								className={`border-petrik-3 last:border-petrik-3/80 h-8 border-b ${index % 2 === 0 ? 'bg-black/20' : 'bg-transparent'}`}
							>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className='border-petrik-3 py-1 text-center [&:not(:first-child)]:border-l'
									>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext(),
										)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='flex items-center justify-between px-4 py-2'>
				<span>Összesen: {data.length}</span>
				{totalPages > 1 && (
					<span className='font-bold'>
						{currentPageIndex + 1}/{totalPages}
					</span>
				)}
			</div>
		</div>
	);
};

export default RoomSubstitution;
