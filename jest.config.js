const pkg = require("./package.json");

/** @type {import("jest").Config} */
const config = {
	transform: {
		"^.+\\.tsx?$": ["@swc/jest", {
			jsc: {
				parser: {
					syntax: "typescript",
					tsx: false,
				},
				target: "es2020",
			},
			module: {
				type: "commonjs",
			},
		}],
	},
	globals: {
		// globals are namespaced so they don't conflict with anything else
		"rpt2__TS_VERSION_RANGE": pkg.peerDependencies.typescript,
		"rpt2__ROLLUP_VERSION_RANGE": pkg.peerDependencies.rollup,
		"rpt2__RPT2_VERSION": pkg.version,
	},

	// jest settings
	injectGlobals: false, // use @jest/globals instead
	restoreMocks: true,
	// only use *.spec.ts files in __tests__, no auto-generated files
	testMatch: ["**/__tests__/**/*.spec.ts?(x)"],
	coveragePathIgnorePatterns: [
		"node_modules", // default
		"<rootDir>/__tests__/" // ignore any test helper files
	],
};

module.exports = config;
