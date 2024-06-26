import { TIMEOUT_SECONDS } from "./config";

/**
 * Function to throw timeout error after certain seconds (passed in parameter) and return rejected promise
 * @param {number} seconds | The number of seconds to wait before throwing timeout error.
 * @returns {promise} | The rejected promise
 */
export const timeout = function (seconds) {
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

export const sendJSON = async function (url, uploadData) {
	try {
		const fetchPro = fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(uploadData),
		});

		const response = await Promise.race([
			fetchPro,
			timeout(TIMEOUT_SECONDS),
		]);
		const data = await response.json();

		if (!response.ok) throw Error(`${data.message} (${response.status})`);
		return data;
	} catch (error) {
		throw error;
	}
};
export const numberToFraction = function (amount) {
	// This is a whole number and doesn't need modification.
	if (parseFloat(amount) === parseInt(amount)) {
		return amount;
	}
	// Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
	const gcd = function (a, b) {
		if (b < 0.0000001) {
			return a;
		}
		return gcd(b, Math.floor(a % b));
	};
	const len = amount.toString().length - 2;
	let denominator = Math.pow(10, len);
	let numerator = amount * denominator;
	var divisor = gcd(numerator, denominator);
	numerator /= divisor;
	denominator /= divisor;
	let base = 0;
	// In a scenario like 3/2, convert to 1 1/2
	// by pulling out the base number and reducing the numerator.
	if (numerator > denominator) {
		base = Math.floor(numerator / denominator);
		numerator -= base * denominator;
	}
	amount = Math.floor(numerator) + "/" + Math.floor(denominator);
	if (base) {
		amount = base + " " + amount;
	}
	return amount;
};
