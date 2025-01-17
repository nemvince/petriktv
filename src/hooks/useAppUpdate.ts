import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';

const useAppUpdate = () => {
	const [appMessage, setAppMessage] = useState('');

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

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	return { appMessage };
};

export default useAppUpdate;
