import { ReactNode } from 'react';
import TableCell from './TableCell';

export type HeaderConfig = {
	icon?: ReactNode;
	title?: string;
};

type TableHeaderProps = {
	headers: HeaderConfig[];
};

const TableHeader = ({ headers }: TableHeaderProps) => {
	return (
		<header className='flex w-full flex-row items-center justify-between border-b border-petrik-3'>
			{headers.map((header, idx) => (
				<TableCell
					className={`gap-x-1 font-semibold ${header.icon && header.title ? `w-1/${headers.length}` : `w-1/${headers.length + 1}`}`}
					key={idx}
				>
					<span>{header.icon}</span>
					<span>{header.title}</span>
				</TableCell>
			))}
		</header>
	);
};

export default TableHeader;
