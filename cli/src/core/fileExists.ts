import { statSync } from "node:fs";

export const fileExists = (path: string) => {
	try {
		const stats = statSync(path);
		return stats.isFile();
	} catch (e) {
		return false;
	}
};
