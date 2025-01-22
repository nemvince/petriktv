import { Departure } from '@/schema/types';

export const REFETCH_INTERVALS = {
	substitutions: 60 * 1000,
	roomSubtitutions: 2 * 60 * 1000,
	news: 2 * 60 * 1000,
	busDepartures: 60 * 1000,
	weather: 10 * 60 * 1000,
} as const;

export const APP_UPDATE_INTERVAL = 30 * 60 * 1000;
export const APP_UPDATE_MESSAGE_LIFETIME = 5 * 1000;

export const PETRIK_LOCATION = '47.50535837979173, 19.090123083749727' as const;

export const DEPARTURES: Departure[] = [
	{
		stopId: 'BKK_F01145',
		displayName: 'Keleti felé',
	},
	{
		stopId: 'BKK_F02716',
		displayName: 'Zugló felé',
	},
	{
		stopId: ['BKK_F01149', 'BKK_F01146'],
		routeFilter: [null, 'BKK_0301'],
		displayName: 'Hősök tere felé',
	},
] as const;
