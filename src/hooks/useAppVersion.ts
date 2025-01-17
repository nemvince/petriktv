import { getVersion } from '@tauri-apps/api/app';
import { useState, useEffect } from 'react';

const useAppVersion = () => {
	const getAppVersion = async () => {
		const version = await getVersion();
		return version;
	};

	const [appVersion, setAppVersion] = useState<string | null>(null);

	useEffect(() => {
		getAppVersion().then(setAppVersion);
	}, []);

	return {
		appVersion,
	};
};

export default useAppVersion;
