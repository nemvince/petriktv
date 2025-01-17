import BusDeparture from './BusDeparture';

const DepartureContainer = () => {
	return (
		<>
			<BusDeparture
				stopId={'BKK_F01145'}
				displayName='Keleti felé'
			/>
			<BusDeparture
				stopId={'BKK_F02716'}
				displayName='Zugló felé'
			/>
			<BusDeparture
				stopId={['BKK_F01149', 'BKK_F01146']}
				routeFilter={[null, 'BKK_0301']}
				displayName='Hősök tere felé'
			/>
		</>
	);
};

export default DepartureContainer;
