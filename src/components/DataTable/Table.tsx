import AnimatedPlaceholder from './AnimatedPlaceholder';
import TableHeader from './TableHeader';
import TableFooter from './TableFooter';
import TableBody from './TableBody';
import useTable from '@/hooks/useTable';

const Table = () => {
	const { emptyMessage } = useTable();
	if (emptyMessage) return <AnimatedPlaceholder title={emptyMessage} />;

	return (
		<section className='flex h-full w-full flex-col rounded-lg'>
			<TableHeader />
			<TableBody />
			<TableFooter />
		</section>
	);
};

export default Table;
