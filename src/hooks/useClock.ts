import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import hu from 'dayjs/locale/hu';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(hu);
dayjs.extend(relativeTime);

const useClock = () => {
	const [clockText, setClockText] = useState(['', 'Betöltés...']);
	useEffect(() => {
		const interval = setInterval(() => {
			const dateText = dayjs().format('YYYY. MMMM DD. dddd');
			const clockText = dayjs().format('HH:mm:ss');
			setClockText([dateText, clockText]);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return {
		clockText,
	};
};

export default useClock;
