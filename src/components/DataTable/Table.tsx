import { TableData } from '@/schema/types';
import AnimatedPlaceholder from './AnimatedPlaceholder';
import TableHeader, { HeaderConfig } from './TableHeader';
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import usePagination from '@/hooks/usePagination';

type TableProps = {
	emptyStateMessage?: string;
	data: TableData;
	headers: Omit<HeaderConfig, 'headerCount'>[];
};
const Table = ({ data, emptyStateMessage, headers }: TableProps) => {
	if (data.length === 0) {
		return (
			<AnimatedPlaceholder title={emptyStateMessage || 'Nincs adat!'} />
		);
	}
	const { currentData, currentPage, totalPages } = usePagination({ data });

	return (
		<section className=''>
			<TableHeader headers={headers} />
			<TableBody currentData={currentData} />
			<TableFooter
				totalItems={data.length}
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</section>
	);
};

export default Table;
