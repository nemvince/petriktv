import { useEffect, useState } from 'react';

interface UsePageCyclerOptions {
	totalPages: number;
	cycleInterval: number;
}

export default function usePageCycler({
	totalPages,
	cycleInterval,
}: UsePageCyclerOptions) {
	const [currentPageIndex, setCurrentPageIndex] = useState(0);

	useEffect(() => {
		setCurrentPageIndex(0);
	}, [totalPages]);

	useEffect(() => {
		if (totalPages <= 1) return;

		const timer = setInterval(() => {
			setCurrentPageIndex((prev) =>
				prev < totalPages - 1 ? prev + 1 : 0,
			);
		}, cycleInterval);

		return () => clearInterval(timer);
	}, [currentPageIndex, totalPages, cycleInterval]);

	return { currentPageIndex };
}
