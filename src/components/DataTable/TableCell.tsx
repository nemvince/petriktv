import { PropsWithChildren } from 'react';

type TableCellProps = PropsWithChildren & {
	className?: string;
};

const TableCell = ({ children, className }: TableCellProps) => {
	return (
		<div
			className={`flex h-5 max-h-5 items-center justify-center border-petrik-3 px-2 py-1 text-center [&:not(:first-child)]:border-l ${className}`}
		>
			{children}
		</div>
	);
};

export default TableCell;
