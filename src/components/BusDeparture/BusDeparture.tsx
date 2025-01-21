import { useQuery } from '@tanstack/react-query';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { components, paths } from '../../schema/bkk';
import { REFETCH_INTERVALS } from '../../lib/constants';
import Loading from '../Queries/Loading';
import QueryError from '../Queries/QueryError';
import DepartureCard from './DepartureCard';

interface BusDepartureProps {
	stopId: string | string[];
	routeFilter?: (string | null)[];
	displayName: string;
}

const BusDeparture = (props: BusDepartureProps) => {
	const getDeparturesForStop = async (
		stopId: string,
		routeFilter?: string,
	) => {
		try {
			//   paths["/my/endpoint"]["get"]["responses"][200]["content"]["application/json"]["schema"];
			const response = await axios.get<
				paths['/{dialect}/api/where/arrivals-and-departures-for-stop']['get']['responses']['200']['content']['application/json']
			>(
				'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop',
				{
					params: {
						key: import.meta.env.VITE_BKK_KEY,
						stopId: stopId,
						minutesBefore: 0,
						minutesAfter: 30,
					},
				},
			);

			const body =
				response.data as components['schemas']['ArrivalsAndDeparturesForStopOTPMethodResponse'];

			if (!body.data || !body.data.entry || !body.data.entry.stopTimes) {
				return null;
			}

			let stopTime: components['schemas']['TransitScheduleStopTime'];
			let routeId: string;
			let routeShortDesc: string;

			if (routeFilter) {
				const trips = body.data?.references?.trips as {
					[key: string]: components['schemas']['TransitTrip'];
				};
				const filt = Object.values(trips).filter(
					(trip) => trip.routeId === routeFilter,
				);

				if (filt.length > 0) {
					const stopTimes = body.data?.entry
						?.stopTimes as components['schemas']['TransitScheduleStopTime'][];
					stopTime = stopTimes.filter((stopTime) =>
						filt.map((f) => f.id).includes(stopTime.tripId),
					)[0];
					routeId = routeFilter;
					routeShortDesc = (
						body.data?.references?.routes as {
							[key: string]: { shortName: string };
						}
					)[routeId].shortName;
				} else {
					return null;
				}
			} else {
				stopTime = body.data.entry.stopTimes[0];
				const tripId = stopTime.tripId as string;
				const trip = (
					body.data.references?.trips as {
						[key: string]: components['schemas']['TransitTrip'];
					}
				)[tripId];
				routeId = trip.routeId as string;
				routeShortDesc = (
					body.data.references?.routes as {
						[key: string]: { shortName: string };
					}
				)[routeId].shortName;
			}

			return {
				routeShortDesc: routeShortDesc,
				predictedDepartureTime:
					stopTime.predictedDepartureTime || stopTime.departureTime,
			};
		} catch {
			return null;
		}
	};

	const { data, isLoading, error } = useQuery({
		queryKey: ['busDeparture', props.stopId],
		retry() {
			return false;
		},
		queryFn: async () => {
			if (Array.isArray(props.stopId)) {
				const results = await Promise.all(
					props.stopId.map((stopId, i) =>
						getDeparturesForStop(
							stopId,
							props.routeFilter?.[i] ?? '',
						),
					),
				);
				return results.find((result) => result !== null) || null;
			} else {
				return await getDeparturesForStop(props.stopId);
			}
		},
		refetchInterval: REFETCH_INTERVALS.busDepartures,
	});

	if (isLoading) return <Loading />;
	if (error) return <QueryError />;

	if (!data) {
		return (
			<div className='flex h-full items-center justify-center gap-3'>
				<Icon
					icon='mdi:alert'
					className='text-4xl text-red-500'
				/>
				<span>Nincs járat!</span>
			</div>
		);
	}

	return (
		<DepartureCard
			data={data}
			displayName={props.displayName}
		/>
	);
};

export default BusDeparture;
