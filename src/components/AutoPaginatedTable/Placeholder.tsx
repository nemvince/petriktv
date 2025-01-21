import { Icon } from '@iconify/react';

const AnimatedPlaceholder = ({ title }: { title: string }) => {
	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<div className='flex items-center gap-2'>
				<Icon
					icon='tabler:pacman'
					className='-mr-3 text-4xl text-petrik-1'
				/>
				{[1, 2, 3, 4, 5].map((dot) => (
					<span
						key={dot}
						className='h-2 w-2 animate-pulse rounded-full bg-petrik-1'
						style={{
							animationDelay: `${dot * 0.1}s`,
							animationDuration: '2s',
						}}
					/>
				))}
			</div>
			<span className='animate-fade-in mt-2 text-xl font-semibold'>
				{title}
			</span>
		</div>
	);
};

export default AnimatedPlaceholder;
