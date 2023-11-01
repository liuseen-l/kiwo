import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK } from '../constants';
import { TypeAgent, } from '../types';

export async function getAgent(options: any): Promise<TypeAgent> {
  const pkgManager = fg
    .sync('*.yaml', {
      cwd: resolve(options.cwd),
      onlyFiles: true,
    })[0];


  if (pkgManager === PNPM_LOCK) {
    return {
      agent: 'pnpm'
    }
  }

  if (pkgManager === YARN_LOCK) {
    return {
      agent: 'yarn'
    }
  }

  if (pkgManager === NPM_LOCK) {
    return {
      agent: 'npm'
    }
  }

  return {
    agent: 'npm'
  }
}
