import { TIMEOUT_SECONDS } from "./config";

/**
 * Function to throw timeout error after certain seconds (passed in parameter) and return rejected promise
 * @param {number} seconds | The number of seconds to wait before throwing timeout error.
 * @returns {promise} | The rejected promise
 */
const timeout = function (seconds) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(
					`Request took too long! Timeout after ${seconds} second`,
				),
			);
		}, seconds * 1000);
	});
};

export const fetchData = async function (url) {
	try {
		const response = await Promise.race([
			fetch(url),
			timeout(TIMEOUT_SECONDS),
		]);
		const data = await response.json();

		if (!response.ok) throw Error(`Status ${response.status}`);
		return data;
	} catch (error) {
		throw Error(error);
	}
};
