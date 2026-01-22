import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('next/jest.js').JestConfigWithTsJest} */
const customJestConfig = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Test environment
    testEnvironment: 'node',

    // Module file extensions for modules
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transform files with ts-jest
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
            },
        }],
    },

    // Ignore transformations for node_modules
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],

    // Collect coverage from all files in the src folder
    // collectCoverageFrom: [
    //   'src/**/*.{js,jsx,ts,tsx}',
    //   '!src/**/*.d.ts',
    // ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);
