import { Icon } from '@iconify/react/dist/iconify.js';

const Loading = () => {
	return (
		<div className='flex h-full items-center justify-center gap-3'>
			<Icon
				icon='mdi:loading'
				className='animate-spin text-4xl'
			/>
			<span className='animate-pulse'>Betöltés...</span>
		</div>
	);
};

export default Loading;
