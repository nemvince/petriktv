import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import { PETRIK_LOCATION, REFETCH_INTERVALS } from '@/lib/constants';
import Loading from '@/components/Queries/Loading';
import QueryError from '@/components/Queries/QueryError';
import getWeather from '@/utils/getWeather';
import { getWindType } from '@/utils/getWeather';

const Weather = () => {
	const { data, isLoading, error } = useQuery({
		queryKey: ['weather'],
		queryFn: async () => getWeather(PETRIK_LOCATION),
		refetchInterval: REFETCH_INTERVALS.weather,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	return (
		<div className='mx-3 flex h-full flex-row items-center justify-between py-2'>
			<div className='flex items-center justify-center'>
				<img
					src={data.current.condition.icon}
					className='h-16 w-16'
				/>
				<span className='self-center text-nowrap text-lg font-bold'>
					{data.current.temp_c} °C
				</span>
			</div>
			<div className='flex flex-col items-center justify-center gap-2'>
				<div className='flex gap-2'>
					<Icon
						icon='mdi:weather-windy'
						className='text-2xl'
					/>
					<span className='text-md self-center text-nowrap'>
						{getWindType(data.current.wind_kph)?.name ||
							`${data.current.wind_kph} km/h`}
					</span>
				</div>
				<div className='flex gap-2'>
					<Icon
						icon='mdi:weather-rainy'
						className='text-2xl'
					/>
					<span className='self-center text-lg'>
						{data.current.precip_mm} mm
					</span>
				</div>
			</div>
		</div>
	);
};

export default Weather;
