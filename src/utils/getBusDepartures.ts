import axios from 'axios';
import { components, paths } from '@/schema/bkk';

const getDeparturesForStop = async (stopId: string, routeFilter?: string) => {
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

			if (filt.length === 0) return null;

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
			routeShortDesc,
			predictedDepartureTime:
				stopTime.predictedDepartureTime || stopTime.departureTime,
		};
	} catch {
		return null;
	}
};

const getBusDepartures = async (
	stopId: string | string[],
	routeFilter?: (string | null)[],
) => {
	if (!Array.isArray(stopId)) return await getDeparturesForStop(stopId);

	const results = await Promise.all(
		stopId.map((stopId, idx) =>
			getDeparturesForStop(stopId, routeFilter?.[idx] ?? ''),
		),
	);
	return results.find((result) => result !== null) || null;
};

export default getBusDepartures;
