import useAppVersion from '@/hooks/useAppVersion';
import { Icon } from '@iconify/react/dist/iconify.js';

const Logo = () => {
	const { appVersion } = useAppVersion();
	return (
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
	);
};

export default Logo;
