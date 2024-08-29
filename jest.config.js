module.exports = {
	// Indicates whether each individual test should be reported during the run
	verbose: false,

	// The root directory that Jest should scan for tests and modules within
	rootDir: '.',

	// A list of paths to directories that Jest should use to search for files in
	roots: ['<rootDir>/src', '<rootDir>/tests'],

	// The test environment that will be used for testing
	testEnvironment: 'jsdom',

	// The glob patterns Jest uses to detect test files
	testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],

	// An array of regexp pattern strings that are matched against all test paths
	testPathIgnorePatterns: ['/node_modules/'],

	// An array of regexp pattern strings that are matched against all source file paths
	transformIgnorePatterns: ['/node_modules/'],

	// Automatically clear mock calls and instances between every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	// A list of reporter names that Jest uses when writing coverage reports
	coverageReporters: ['text', 'lcov'],

	// An object that configures minimum threshold enforcement for coverage results
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};
