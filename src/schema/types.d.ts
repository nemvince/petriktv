import { PeriodNumber } from '@/utils/periods';
import { ReactNode } from 'react';

export type Substitution = {
	lesson: `${PeriodNumber}-${PeriodNumber}` | PeriodNumber;
	teacher: string;
	missing: string;
	className: string;
	classroom: string;
	consolidated: boolean;
};

export type SubstitutionResponse = {
	ora: `${PeriodNumber}.óra`;
	tname: string;
	helytan: string;
	class: string;
	terem: string;
	ovh: '0' | '1';
};

export type RoomSubstitution = {
	lesson: `${PeriodNumber}-${PeriodNumber}` | PeriodNumber;
	from: string;
	to: string;
	className: string;
};

export type RoomSubstitutionResponse = {
	ora: `${PeriodNumber}.óra`;
	tname: string;
	class: string;
	terem: string;
};

export type TableData = Substitution[] | RoomSubstitution[];

export type HeaderConfig = {
	icon?: ReactNode;
	title?: string;
	headerKey: keyof Substitution | keyof RoomSubstitution;
	render?: (value: any) => ReactNode;
};

export type Departure = {
	stopId: string | string[];
	displayName: string;
	routeFilter?: (null | string)[];
};

export type NewsResponse = any;
