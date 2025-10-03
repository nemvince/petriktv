import axios from 'axios';
import windTypes from '@/assets/windTypes.json' assert { type: 'json' };

export type WindType = (typeof windTypes)[number];

export const getWindType = (kph: number) => {
	return (
		windTypes.find((type) => kph >= type.kph.min && kph <= type.kph.max) ||
		null
	);
};

const getWeather = async (location: `${number},${number}`) => {
	const { data } = await axios.get(
		'https://api.weatherapi.com/v1/current.json',
		{
			params: {
				key: import.meta.env.VITE_WEATHER_KEY,
				q: location,
				lang: 'hu',
			},
		},
	);

	return data;
};

export default getWeather;
