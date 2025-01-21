import axios from 'axios';
import { getCurrentPeriod } from './periods';
import { Substitution } from '../schema/types';

const getSubstitutions = async () => {
	const response = await axios.get('https://helyettesites.petrik.hu/api/', {
		params: {
			status: 'napihely',
		},
	});
	if (response.status !== 200) {
		throw new Error('Network response was not ok');
	}

	const respData = response.data;
	const currentPeriod = getCurrentPeriod();
	if (!currentPeriod || !respData || !Array.isArray(respData)) return [];

	//Group the data by teacher and class
	const groupedData = groupData(respData);

	// Consolidate the data by teacher, class, missing, and classroom
	const consolidatedData = consolidateData(Object.values(groupedData).flat());

	//Remove the substitutions that are in the past
	const currentSubstitutions = consolidatedData.filter((item) => {
		const lesson =
			typeof item.lesson === 'string'
				? Number(item.lesson.split('-').at(-1))
				: item.lesson;
		return lesson >= currentPeriod.period;
	});

	// Sort the consolidated data by lesson
	return currentSubstitutions.sort((a, b) => {
		const lessonA =
			typeof a.lesson === 'string'
				? Number(a.lesson.split('-')[0])
				: a.lesson;
		const lessonB =
			typeof b.lesson === 'string'
				? Number(b.lesson.split('-')[0])
				: b.lesson;

		return lessonA - lessonB;
	});
};
export default getSubstitutions;

const groupData = (data: any[]): Record<string, Substitution[]> =>
	data.reduce((acc: Record<string, Substitution[]>, item: any) => {
		const key = `${item.tname}-${item.class}`;
		const transformedItem: Substitution = {
			lesson: Number(item.ora.split('.')[0]),
			teacher: item.tname,
			missing: item.helytan,
			className: item.class,
			classroom: item.terem.split('-')[0],
			consolidated: item.ovh === '1',
		};

		if (!acc[key]) {
			acc[key] = [];
		}
		acc[key].push(transformedItem);
		return acc;
	}, {});

const consolidateData = (data: Substitution[]): Substitution[] => {
	const consolidatedData: Record<string, Substitution> = data.reduce(
		(acc: Record<string, Substitution>, item: Substitution) => {
			const key = `${item.teacher}-${item.className}-${item.missing}-${item.classroom}`;
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

			const consolidatedLesson = `${lessonStart}-${lessonEnd}`;

			acc[key] = {
				...existingItem,
				lesson: consolidatedLesson,
				consolidated: true,
			};

			return acc;
		},
		{},
	);

	return Object.values(consolidatedData);
};
