import { Icon } from '@iconify/react';
import News from './News';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';
import relativeTime from 'dayjs/plugin/relativeTime';
import useAppVersion from '../hooks/useAppVersion';
import useClock from '../hooks/useClock';

interface HeaderProps {
	appMessage: string;
}

dayjs.locale(hu);
dayjs.extend(relativeTime);

const Header = ({ appMessage }: HeaderProps) => {
	const { appVersion } = useAppVersion();
	const { clockText } = useClock();

	return (
		<div className='box p-1 mx-2 mb-2 px-2.5 flex flex-row justify-between'>
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
				<span>{appMessage}</span>
			</div>
			<div className='flex gap-3 items-center'>
				<span className=''>{clockText[0]}</span>
				<span className='font-bold'>{clockText[1]}</span>
			</div>
		</div>
	);
};

export default Header;
