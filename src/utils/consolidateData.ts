import { PeriodNumber } from './periods';

const consolidateData = <
	T extends { lesson: PeriodNumber | `${PeriodNumber}-${PeriodNumber}` },
>(
	data: T[],
	keys: Array<keyof T>,
): T[] => {
	const consolidated: Record<string, T> = data.reduce(
		(acc: Record<string, T>, item: T) => {
			const key = keys.map((key) => item[key]).join('-');
			if (!acc[key]) {
				acc[key] = item;
				return acc;
			}

			const existingItem = acc[key];
			const lessonA =
				typeof item.lesson === 'string'
					? item.lesson.split('-')
					: [item.lesson];
			const lessonB =
				typeof existingItem.lesson === 'string'
					? existingItem.lesson.split('-')
					: [existingItem.lesson];

			const lessonStart = Math.min(
				Number(lessonA[0]),
				Number(lessonB[0]),
			);

			const lessonEnd = Math.max(
				Number(lessonA.at(-1)),
				Number(lessonB.at(-1)),
			);

			const consolidatedLesson =
				`${lessonStart}-${lessonEnd}` as `${PeriodNumber}-${PeriodNumber}`;

			acc[key] = {
				...existingItem,
				lesson: consolidatedLesson,
			};

			return acc;
		},
		{},
	);

	console.log(Object.values(consolidated));

	return Object.values(consolidated);
};

export default consolidateData;
