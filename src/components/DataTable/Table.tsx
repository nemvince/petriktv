import AnimatedPlaceholder from './AnimatedPlaceholder';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import useTable from '@/hooks/useTable';

const Table = () => {
	const { data, emptyMessage } = useTable();
	if (data.length === 0) return <AnimatedPlaceholder title={emptyMessage} />;

	return (
		<section className='h-full w-full rounded-lg'>
			<TableHeader />
			<TableBody />
			<TableFooter />
		</section>
	);
};

export default Table;
