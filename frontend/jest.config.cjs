// jest.config.cjs
/** @type {import('jest').JestConfig} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.(ts|tsx|js|jsx|cjs)$": "babel-jest",
	},
	moduleNameMapper: {
		"\\.(css|less|scss|sass)$": "identity-obj-proxy",
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	transformIgnorePatterns: ["/node_modules/"],
	extensionsToTreatAsEsm: [".ts", ".tsx", ".cjs"],
};
