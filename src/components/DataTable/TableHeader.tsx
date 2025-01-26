import useTable from '@/hooks/useTable';
import TableCell from './TableCell';

const TableHeader = () => {
	const { headers } = useTable();
	return (
		<header className='flex h-fit items-center justify-between border-b border-petrik-3'>
			{headers.map((header, idx) => (
				<TableCell
					key={idx}
					className={`w-fit font-semibold ${header.icon && header.title ? 'gap-x-1' : ''}`}
				>
					<span>{header.icon}</span>
					<span>{header.title}</span>
				</TableCell>
			))}
		</header>
	);
};

export default TableHeader;
