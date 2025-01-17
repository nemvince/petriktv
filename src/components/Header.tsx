import { Icon } from '@iconify/react';
import News from './News';
import useAppVersion from '../hooks/useAppVersion';
import useClock from '../hooks/useClock';

interface HeaderProps {
	message: string;
}
const Header = ({ message }: HeaderProps) => {
	const { appVersion } = useAppVersion();
	const { clockText } = useClock();

	return (
		<>
			<div>
				<span className='font-bold text-lg flex gap-1 items-center'>
					<Icon
						icon='pepicons-print:television'
						className='text-2xl'
					/>
					<span>
						PetrikTV
						<span className='text-sm font-light self-end'>
							{appVersion || 'redux'}
						</span>
					</span>
				</span>
			</div>
			<div className='max-w-md flex center items-center'>
				<News />
				<span>{message}</span>
			</div>
			<div className='flex gap-3 items-center'>
				<span className=''>{clockText[0]}</span>
				<span className='font-bold'>{clockText[1]}</span>
			</div>
		</>
	);
};

export default Header;
