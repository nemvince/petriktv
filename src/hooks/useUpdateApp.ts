import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';

const useUpdateApp = () => {
	const [appMessage, setAppMessage] = useState('');

	const updateApp = async () => {
		setTimeout(() => setAppMessage(''), 5000);

		setAppMessage('Checking for updates...');
		const update = await check();
		if (!update) {
			setAppMessage('No updates available');
			return;
		}

		setAppMessage('Downloading update...');
		await update.downloadAndInstall();
		relaunch();
	};

	// shortcuts:
	// U: check for updates
	// R: reload the app
	useEffect(() => {
		const handleKeyDown = async (e: KeyboardEvent) => {
			if (e.key !== 'u' && e.key !== 'r') return;
			if (e.key === 'r') {
				setAppMessage('Reloading...');
				window.location.reload();
				return;
			}
			await updateApp();
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	//Update every 60 minutes
	useEffect(() => {
		const interval = setInterval(
			async () => {
				const update = await check();
				if (update) {
					await update.downloadAndInstall();
					relaunch();
				}
			},
			60 * 60 * 1000,
		);
		return () => clearInterval(interval);
	}, []);

	return { appMessage };
};

export default useUpdateApp;
