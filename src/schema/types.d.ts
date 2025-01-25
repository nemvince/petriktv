import { PeriodNumber } from '@/utils/periods';

export type Substitution = {
	lesson: `${PeriodNumber}-${PeriodNumber}` | PeriodNumber;
	teacher: string;
	missing: string;
	className: string;
	classroom: string;
	consolidated: boolean;
};

export type RoomSubstitutionEntry = {
	lesson: PeriodNumber;
	from: string;
	to: string;
	class: string;
};

export type RoomSubstitutionResponse = {
	ora: `${PeriodNumber}.óra`;
	tname: string;
	class: string;
	terem: string;
};

export type TableData = Substitution[] | RoomSubstitutionEntry[];

export type Departure = {
	stopId: string | string[];
	displayName: string;
	routeFilter?: (null | string)[];
};

export type NewsResponse = any;
