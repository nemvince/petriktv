const REFETCH_INTERVALS = {
	substitutions: 60 * 1000,
	roomSubtitutions: 2 * 60 * 1000,
	news: 2 * 60 * 1000,
	busDepartures: 60 * 1000,
	weather: 10 * 60 * 1000,
} as const;

const PETRIK_LOCATION = '47.50535837979173, 19.090123083749727' as const;

export { REFETCH_INTERVALS, PETRIK_LOCATION };
