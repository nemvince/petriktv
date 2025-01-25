import useTable from '@/hooks/useTable';

const TableFooter = () => {
	const { currentPage, totalPages, totalItems } = useTable();
	return (
		<footer className='mx-4 mt-2 flex h-5 max-h-5 items-center justify-between'>
			<span>Összesen: {totalItems}</span>
			{totalPages > 1 && (
				<span className='font-bold'>
					{currentPage + 1}/{totalPages}
				</span>
			)}
		</footer>
	);
};

export default TableFooter;
