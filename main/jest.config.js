// jest.config.js
export default {
	transform: {
		"^.+\\.js$": "babel-jest",
	},
	transformIgnorePatterns: ["/node_modules/"],
	testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
	setupFilesAfterEnv: ["./jest.setup.js"],
};
