import dayjs from 'dayjs';
import UpdateLocale from 'dayjs/plugin/updateLocale';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/hu';
import { Icon } from '@iconify/react/dist/iconify.js';

dayjs.extend(relativeTime);
dayjs.extend(UpdateLocale);
dayjs.updateLocale('hu', {
	relativeTime: {
		future: '%s',
		past: 'Indul!',
		s: 'Indul!',
		m: 'Indul!',
		mm: "%d'",
		h: 'Nincs járat',
		hh: 'Nincs járat',
	},
});

interface DepartureCardProps {
	data: {
		routeShortDesc: string | null;
		predictedDepartureTime: number | null | undefined;
	};
	displayName: string;
}
const DepartureCard = (props: DepartureCardProps) => {
	return (
		<div className='mx-2 flex items-center justify-between'>
			<h2 className='self-center'>{props.displayName}</h2>
			<div className='flex gap-1'>
				<span className='self-center text-sm font-bold'>
					{props.data.predictedDepartureTime
						? dayjs(
								(props.data.predictedDepartureTime || 0) * 1000,
							).fromNow()
						: '??'}
				</span>
				<div className='flex h-6 items-center gap-1 rounded-full bg-cyan-600 pl-1 pr-1.5'>
					<Icon
						icon='mdi:bus'
						className='rounded-full bg-white p-0.5 text-xl text-cyan-600'
					/>
					<span className='font-bold'>
						{props.data.routeShortDesc || '???'}
					</span>
				</div>
			</div>
		</div>
	);
};

export default DepartureCard;
