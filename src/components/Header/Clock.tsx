import useClock from '@/hooks/useClock';

const Clock = () => {
	const { clockText } = useClock();
	return (
		<div className='flex items-center gap-2'>
			<span className=''>{clockText[0]}</span>
			<span className='font-bold'>{clockText[1]}</span>
		</div>
	);
};

export default Clock;
