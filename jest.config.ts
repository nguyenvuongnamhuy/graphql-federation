import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../report/coverage',
  testEnvironment: 'node',
  moduleDirectories: ['src', 'node_modules'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/$1',
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/dist/',
    '<rootDir>/node_modules/',
    '.module.ts',
    '.dto.ts',
    '.config.ts',
    '.configs.ts',
    'index.ts',
    'exception.filter.ts',
    'request-logging.interceptor.ts',
    'logger.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
};

export default config;
