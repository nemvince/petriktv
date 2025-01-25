import TableCell from './TableCell';
import { HeaderConfig } from './TableHeader';

const HeaderCell = ({ icon, title, headerCount }: HeaderConfig) => {
	const width =
		icon && title ? `w-1/${headerCount}` : `w-1/${headerCount + 1}`;
	return (
		<TableCell className={`gap-x-1 ${width}`}>
			<span>{icon}</span>
			<span>{title}</span>
		</TableCell>
	);
};

export default HeaderCell;
