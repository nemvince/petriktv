import axios from 'axios';
import {
	RoomSubstitutionEntry,
	RoomSubstitutionResponse,
} from '@/schema/types';
import { getCurrentPeriod, PeriodNumber } from '@/utils/periods';

const getRoomSubstitutions = async (): Promise<RoomSubstitutionEntry[]> => {
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

	const todaySubs: RoomSubstitutionEntry[] = respData
		.map((item: RoomSubstitutionResponse) => {
			return {
				lesson: Number(item.ora.split('.')[0]) as PeriodNumber,
				from: item.tname.split('-')[0],
				to: item.terem.split('-')[0],
				class: item.class,
			};
		})
		.filter((item) => item.lesson >= currentPeriod.period);

	return todaySubs;
};

export default getRoomSubstitutions;
