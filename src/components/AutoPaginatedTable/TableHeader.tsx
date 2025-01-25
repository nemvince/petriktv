import { ReactNode } from 'react';
import HeaderCell from './HeaderCell';

export type HeaderConfig = {
	icon?: ReactNode;
	title?: string;
	headerCount: number;
};

type TableHeaderProps = {
	headers: Omit<HeaderConfig, 'headerCount'>[];
};

const TableHeader = ({ headers }: TableHeaderProps) => {
	const headerCount = headers.length;
	return (
		<div className='flex-grow flex-row'>
			{headers.map((header, idx) => (
				<HeaderCell
					key={idx}
					headerCount={headerCount}
					{...header}
				/>
			))}
		</div>
	);
};

export default TableHeader;
