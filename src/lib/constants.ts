import { Departure } from '@/schema/types';

export const REFETCH_INTERVALS = {
	substitutions: 30000,
	roomSubtitutions: 60000,
	news: 120000,
	busDepartures: 30000,
	weather: 600000,
} as const;

export const PETRIK_LOCATION = '47.50535837979173, 19.090123083749727' as const;

export const APP_UPDATE_INTERVAL = 1800000 as const;
export const APP_UPDATE_MESSAGE_LIFETIME = 5000 as const;

export const CYCLE_INTERVAL = 5000 as const;
export const ITEMS_PER_PAGE = 5 as const;

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
