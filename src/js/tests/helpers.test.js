import { vi } from "vitest";
import { fetchData, timeout } from "../helpers.js";

// Mock the fetch function
global.fetch = vi.fn();

describe("timeout()", () => {
	/**
	 * This function throws 'Request took too long' error after user defined number of seconds passed in parameter.
	 * @param {integer} inputSeconds | number of seconds to wait
	 */
	const runTimeoutTest = async (inputSeconds) => {
		vi.useFakeTimers();
		const result = timeout(inputSeconds);

		vi.advanceTimersByTime(inputSeconds * 1000);
		await expect(result).rejects.toThrowError(
			`Request took too long! Timeout after ${inputSeconds} second`,
		);
	};

	it("should reject the promise after a user defined seconds passed in parameter", async () => {
		await runTimeoutTest(2);
	});

	it("should reject the promise with correct error message", async () => {
		await runTimeoutTest(2);
	});

	it("should reject correctly for different timeout values", async () => {
		await runTimeoutTest(5);
	});

	it("should reject immediately if timeout is set to 0 seconds", async () => {
		await runTimeoutTest(0);
	});
});

describe("fetchData()", () => {
	const testInput = "https://api.test.com/data";
	const testResponseData = { message: "Success" };

	it("should throw an error if fetch response is not ok", async () => {
		// Mock fetch implementation for a failed response
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				status: 404,
				json: () => Promise.resolve({}),
			}),
		);

		// Expect fetchData to throw an error
		await expect(fetchData(testInput)).rejects.toThrow("Status 404");
	});

	it("should resolve with correct response data", async () => {
		// Mock fetch implementation for a successful response
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(testResponseData),
			}),
		);

		// Expect fetchData to return the correct data
		const data = await fetchData(testInput);
		expect(data).toEqual(testResponseData);
	});

	it("should handle network errors", async () => {
		// Mock fetch implementation to simulate a network error
		fetch.mockImplementationOnce(() =>
			Promise.reject(new Error("Network error")),
		);

		// Expect fetchData to throw a network error
		await expect(fetchData(testInput)).rejects.toThrow("Network error");
	});
});
