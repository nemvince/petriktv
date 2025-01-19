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

	// First, group the data by missing teacher and class name
	const groupedData = groupData(respData);

	// Consolidate entries
	const consolidatedData: Substitution[] = Object.values(groupedData)
		.map((group) => {
			// Check if all lessons have the same classroom and teacher
			const sameClassroom = group.every(
				(g) => g.classroom === group[0].classroom,
			);
			const sameTeacher = group.every(
				(g) => g.teacher === group[0].teacher,
			);

			if (sameClassroom && sameTeacher) {
				// Sort lessons to ensure correct order
				const sortedLessons = group
					.map((g) => g.lesson)
					.sort((a: any, b: any) => a - b);

				// Create a consolidated entry
				return {
					...group[0],
					lesson:
						sortedLessons.length > 1
							? `${sortedLessons[0]}-${
									sortedLessons[sortedLessons.length - 1]
								}`
							: sortedLessons[0],
				};
			} else {
				// If not all lessons have the same classroom and teacher, return the group as is
				return group;
			}
		})
		.flat();

	const consolidatedDataInFuture = consolidatedData.filter(
		(item) => (item.lesson as number) >= currentPeriod.period,
	);

	// Sort the consolidated data by lesson
	return consolidatedDataInFuture.sort((a, b) => {
		// Handle string lessons (consolidated) and number lessons
		const lessonA =
			typeof a.lesson === 'string'
				? parseInt(a.lesson.split('-')[0])
				: a.lesson;
		const lessonB =
			typeof b.lesson === 'string'
				? parseInt(b.lesson.split('-')[0])
				: b.lesson;

		return lessonA - lessonB;
	});
};

const groupData = (data: any[]): Record<string, Substitution[]> => {
	const grouped = data.reduce(
		(acc: Record<string, Substitution[]>, item: any) => {
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
		},
		{},
	);

	return grouped;
};

export default getSubstitutions;
