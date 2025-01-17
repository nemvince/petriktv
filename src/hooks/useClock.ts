import dayjs from 'dayjs';
import { useState, useEffect } from 'react';

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
