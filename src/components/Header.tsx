import { Icon } from '@iconify/react';
import News from '@/components/News';
import useAppVersion from '@/hooks/useAppVersion';
import useClock from '@/hooks/useClock';

interface HeaderProps {
	message: string;
}
const Header = ({ message }: HeaderProps) => {
	const { appVersion } = useAppVersion();
	const { clockText } = useClock();

	return (
		<>
			<div>
				<span className='flex items-center gap-1 text-lg font-bold'>
					<Icon
						icon='pepicons-print:television'
						className='text-2xl'
					/>
					<span>
						PetrikTV
						<span className='self-end text-sm font-light'>
							{appVersion || 'redux'}
						</span>
					</span>
				</span>
			</div>
			<div className='center flex max-w-md items-center'>
				<News />
				<span>{message}</span>
			</div>
			<div className='flex items-center gap-2'>
				<span className=''>{clockText[0]}</span>
				<span className='font-bold'>{clockText[1]}</span>
			</div>
		</>
	);
};

export default Header;
