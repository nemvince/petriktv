import { PropsWithChildren } from 'react';

type TableCellProps = PropsWithChildren & {
	className?: string;
};

const TableCell = ({ children, className }: TableCellProps) => {
	return (
		<div
			className={`flex h-full flex-grow items-center justify-center text-wrap border-petrik-3 px-2 py-1 [&:not(:first-child)]:border-l ${className}`}
		>
			{children}
		</div>
	);
};

export default TableCell;
