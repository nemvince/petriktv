import axios from 'axios';

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
