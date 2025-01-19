import axios from 'axios';
import { NewsResponse } from '../schema/types';

const getNews = async (): Promise<NewsResponse[]> => {
	const response = await axios.get('https://helyettesites.petrik.hu/api/', {
		params: {
			status: 'napihir',
		},
	});

	if (response.status !== 200) {
		throw new Error('Network response was not ok');
	}

	const respData: NewsResponse[] | string | undefined = response.data;
	if (!Array.isArray(respData)) return [];

	return respData;
};

export default getNews;
