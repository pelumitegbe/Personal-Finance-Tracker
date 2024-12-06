module.exports = {
	transform: {
		"^.+\\.[tj]sx?$": "babel-jest",
	},
	moduleNameMapper: {
		"\\.(css|less|scss|sss|styl)$": "identity-obj-proxy",
	},
	testEnvironment: "jsdom",
};
