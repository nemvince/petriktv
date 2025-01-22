import { relaunch } from '@tauri-apps/plugin-process';
import { check } from '@tauri-apps/plugin-updater';
import { useEffect, useState } from 'react';
import {
	APP_UPDATE_INTERVAL,
	APP_UPDATE_MESSAGE_LIFETIME,
} from '@/lib/constants';

const useUpdateApp = () => {
	const [appMessage, setAppMessage] = useState('');

	const updateApp = async () => {
		setTimeout(() => setAppMessage(''), APP_UPDATE_MESSAGE_LIFETIME);

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
		const interval = setInterval(async () => {
			const update = await check();
			if (update) {
				await update.downloadAndInstall();
				relaunch();
			}
		}, APP_UPDATE_INTERVAL);
		return () => clearInterval(interval);
	}, []);

	return { appMessage };
};

export default useUpdateApp;
