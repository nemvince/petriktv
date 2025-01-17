import { Icon } from '@iconify/react/dist/iconify.js';

const QueryError = () => {
	return (
		<div className='flex h-full items-center justify-center gap-3'>
			<Icon
				icon='mdi:alert'
				className='text-4xl text-red-500'
			/>
			<span>Hiba történt!</span>
		</div>
	);
};

export default QueryError;
