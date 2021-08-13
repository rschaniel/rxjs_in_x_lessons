/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    clearMocks: true,
    roots: [
        '<rootDir>/src',
    ],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: [
        '/node_modules/',
    ],
    transform: {
        '^.+\\.ts?$': 'ts-jest'
    },
    testTimeout: 30_000
};