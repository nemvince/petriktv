import axios from 'axios';
import { getCurrentPeriod, PeriodNumber } from '@/utils/periods';
import { Substitution, SubstitutionResponse } from '@/schema/types';
import consolidateData from './consolidateData';

const getSubstitutions = async () => {
	const response = await axios.get('https://helyettesites.petrik.hu/api/', {
		params: {
			status: 'napihely',
		},
	});
	if (response.status !== 200) {
		throw new Error('Network response was not ok');
	}

	const respData = response.data as
		| SubstitutionResponse[]
		| string
		| undefined;
	const currentPeriod = getCurrentPeriod();
	if (!currentPeriod || !respData || !Array.isArray(respData)) return [];

	//Group the data by teacher and class
	const groupedData = groupData(respData);

	// Consolidate the data by teacher, class, missing, and classroom
	const consolidatedData = consolidateData(
		Object.values(groupedData).flat(),
		['teacher', 'className', 'missing', 'classroom'],
	);

	//Remove the substitutions that are in the past
	const currentSubstitutions = consolidatedData.filter((item) => {
		const lesson =
			typeof item.lesson === 'string'
				? Number(item.lesson.split('-').at(-1))
				: item.lesson;
		return lesson >= currentPeriod.period;
	});

	// Sort the consolidated data by lesson
	// put consolidated lessons to the end of starting lesson group
	return currentSubstitutions.sort((a, b) => {
		const lessonA =
			typeof a.lesson === 'string'
				? Number(a.lesson.split('-')[0])
				: a.lesson;
		const lessonB =
			typeof b.lesson === 'string'
				? Number(b.lesson.split('-')[0])
				: b.lesson;

		if (lessonA === lessonB) {
			return typeof a.lesson === 'string' ? 1 : -1;
		}
		return lessonA - lessonB;
	});
};
export default getSubstitutions;

const groupData = (
	data: SubstitutionResponse[],
): Record<string, Substitution[]> =>
	data.reduce(
		(acc: Record<string, Substitution[]>, item: SubstitutionResponse) => {
			const key = `${item.tname}-${item.class}`;
			const transformedItem: Substitution = {
				lesson: Number(item.ora.split('.')[0]) as PeriodNumber,
				teacher: item.tname.trim(),
				missing: item.helytan.trim(),
				className: item.class.trim(),
				classroom: item.terem.split('-')[0].trim(),
				consolidated: item.ovh === '1',
			};

			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(transformedItem);
			return acc;
		},
		{},
	);
