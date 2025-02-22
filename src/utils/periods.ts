import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const getCurrentPeriod = () => {
	const now = dayjs();

	const currentPeriod: TPeriod | undefined = periods.find((period, idx) => {
		const endTime = dayjs(period.endtime, 'HH:mm');
		const prevEndTime =
			idx > 0
				? dayjs(periods[idx - 1].endtime, 'HH:mm')
				: dayjs('00:00', 'HH:mm');

		return now.isAfter(prevEndTime) && now.isBefore(endTime);
	});

	return currentPeriod;
};

type PeriodNumber = (typeof periods)[number]['period'];
type TPeriod = {
	period: PeriodNumber;
	starttime: string;
	endtime: string;
};

const periods = [
	{
		period: 0,
		starttime: '7:10',
		endtime: '7:55',
	},
	{
		period: 1,
		starttime: '8:00',
		endtime: '8:45',
	},
	{
		period: 2,
		starttime: '8:55',
		endtime: '9:40',
	},
	{
		period: 3,
		starttime: '9:55',
		endtime: '10:40',
	},
	{
		period: 4,
		starttime: '10:50',
		endtime: '11:35',
	},
	{
		period: 5,
		starttime: '11:45',
		endtime: '12:30',
	},
	{
		period: 6,
		starttime: '12:50',
		endtime: '13:35',
	},
	{
		period: 7,
		starttime: '13:45',
		endtime: '14:30',
	},
	{
		period: 8,
		starttime: '14:35',
		endtime: '15:20',
	},
	{
		period: 9,
		starttime: '15:20',
		endtime: '16:00',
	},
	{
		period: 10,
		starttime: '16:00',
		endtime: '16:40',
	},
	{
		period: 11,
		starttime: '16:45',
		endtime: '17:25',
	},
	{
		period: 12,
		starttime: '17:30',
		endtime: '18:10',
	},
	{
		period: 13,
		starttime: '18:15',
		endtime: '18:55',
	},
	{
		period: 14,
		starttime: '19:00',
		endtime: '19:40',
	},
	{
		period: 15,
		starttime: '19:45',
		endtime: '20:25',
	},
	{
		period: 16,
		starttime: '20:30',
		endtime: '21:10',
	},
] as const;

export default periods;
export { getCurrentPeriod };
export type { PeriodNumber };
