import useTable from '@/hooks/useTable';

const TableFooter = () => {
	const { currentPage, totalPages, totalItems } = useTable();
	return (
		<footer className='flex h-fit max-h-fit items-center justify-between border-t border-petrik-3 px-4 py-2'>
			<span>Összesen: {totalItems}</span>
			{totalPages > 1 && (
				<span className='font-bold'>
					{currentPage}/{totalPages}
				</span>
			)}
		</footer>
	);
};

export default TableFooter;
