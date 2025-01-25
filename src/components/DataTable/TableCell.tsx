import { PropsWithChildren } from 'react';

type TableCellProps = PropsWithChildren & {
	className?: string;
};

const TableCell = ({ children, className }: TableCellProps) => {
	return (
		<div
			className={`flex h-5 max-h-5 items-center justify-center px-3 ${className}`}
		>
			{children}
		</div>
	);
};

export default TableCell;
