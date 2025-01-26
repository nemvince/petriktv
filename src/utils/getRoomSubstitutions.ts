import axios from 'axios';
import { RoomSubstitution, RoomSubstitutionResponse } from '@/schema/types';
import { getCurrentPeriod, PeriodNumber } from '@/utils/periods';
import consolidateData from './consolidateData';

const getRoomSubstitutions = async (): Promise<RoomSubstitution[]> => {
	const response = await axios.get('https://helyettesites.petrik.hu/api/', {
		params: {
			status: 'teremhely',
		},
	});
	if (response.status !== 200) {
		throw new Error('Network response was not ok');
	}

	const respData: RoomSubstitutionResponse[] | string | undefined =
		response.data;
	const currentPeriod = getCurrentPeriod();
	if (!respData || !Array.isArray(respData) || !currentPeriod) {
		return [];
	}

	const todaySubs: RoomSubstitution[] = respData.map(
		(item: RoomSubstitutionResponse) => {
			return {
				lesson: Number(item.ora.split('.')[0]) as PeriodNumber,
				from: item.tname.split('-')[0].trim(),
				to: item.terem.split('-')[0].trim(),
				className: item.class.trim(),
			};
		},
	);

	const consolidatedData = consolidateData(todaySubs, [
		'from',
		'to',
		'className',
	]);

	const currentSubstitutions = consolidatedData.filter((item) => {
		const lesson =
			typeof item.lesson === 'string'
				? Number(item.lesson.split('-').at(-1))
				: item.lesson;
		return lesson >= currentPeriod.period;
	});

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

export default getRoomSubstitutions;
