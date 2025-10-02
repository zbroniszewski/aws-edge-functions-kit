/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import { pathsToModuleNameMapper } from 'ts-jest/utils';
const compilerOptions = import('./tsconfig.json');

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
};
