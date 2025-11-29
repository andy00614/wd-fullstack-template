import { describe, expect, it } from "vitest";
import { add, formatCurrency } from "./utils";

describe("add", () => {
	it("adds two numbers", () => {
		expect(add(1, 2)).toBe(3);
	});

	it("handles negative numbers", () => {
		expect(add(-1, 1)).toBe(0);
	});
});

describe("formatCurrency", () => {
	it("formats USD by default", () => {
		expect(formatCurrency(100)).toBe("$100.00");
	});

	it("formats other currencies", () => {
		expect(formatCurrency(100, "EUR")).toBe("\u20AC100.00");
	});
});
