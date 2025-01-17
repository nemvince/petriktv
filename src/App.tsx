import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Substitutions from './components/Substitutions';
import RoomSubstitution from './components/RoomSubstitution';
import Weather from './components/Weather';
import DepartureContainer from './components/DepartureContainer';
import useUpdateApp from './hooks/useUpdateApp';

const queryClient = new QueryClient();

function App() {
	const { appMessage } = useUpdateApp();

	return (
		<QueryClientProvider client={queryClient}>
			<main className='h-full py-2 bg-gradient-to-br from-petrik-1 to-petrik-2 text-stone-100 flex flex-col'>
				<div className='box p-1 mx-2 mb-2 px-2.5 flex flex-row justify-between'>
					<Header message={appMessage} />
				</div>

				<div className='mx-1.5 flex-grow grid grid-cols-3 gap-1.5'>
					<div className='col-span-1 grid grid-rows-4 gap-1.5'>
						<div className='box grid grid-rows-3'>
							<DepartureContainer />
						</div>

						<div className='box'>
							<Weather />
						</div>

						<div className='row-span-2 box'>
							<RoomSubstitution />
						</div>
					</div>

					<div className='col-span-2 row-span-1 box'>
						<Substitutions />
					</div>
				</div>
			</main>
		</QueryClientProvider>
	);
}

export default App;
