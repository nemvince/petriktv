import { DEPARTURES } from '@/lib/constants';
import BusDeparture from '@/components/BusDeparture/BusDeparture';

const DepartureContainer = () => {
	return (
		<>
			{DEPARTURES.map((departure, idx) => (
				<BusDeparture
					key={idx}
					{...departure}
				/>
			))}
		</>
	);
};

export default DepartureContainer;
