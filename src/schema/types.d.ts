export type Substitution = {
	lesson: string | number;
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

export type NewsResponse = any;
