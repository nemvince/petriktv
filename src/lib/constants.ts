const REFETCH_INTERVALS = {
	substitutions: 60 * 1000,
	roomSubtitutions: 2 * 60 * 1000,
	news: 2 * 60 * 1000,
	busDepartures: 60 * 1000,
	weather: 10 * 60 * 1000,
} as const;

export { REFETCH_INTERVALS };
