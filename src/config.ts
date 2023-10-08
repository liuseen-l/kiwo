import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK } from './constants';

export const pkgRoot = process.cwd();

async function getPackages() {
  const pkgPath = resolve(pkgRoot, 'package.json')
  const { devDependencies, dependencies } = await fs.readJSON(pkgPath)
  return {
    devDependencies,
    dependencies
  }
};

async function resolveManager() {
  const pkgManager = fg
    .sync('*.yaml', {
      cwd: resolve(process.cwd()),
      onlyFiles: true,
    })[0];

  if (pkgManager === PNPM_LOCK) {
    return 'pnpm'
  }

  if (pkgManager === YARN_LOCK) {
    return 'yarn'
  }

  if (pkgManager === NPM_LOCK) {
    return 'npm'
  }

  return 'null'
}

async function resolveMove() {




  const pkgMeta = await getPackages()
  const pkgManager = await resolveManager()
  console.log(pkgMeta);
  console.log(pkgManager);


}

export async function resolveConfig<T>(options: any): Promise<void> {
  // move
  if (options.m || options.move) {
    resolveMove()
    return
  }

  // remove
  if (options.r || options.remove) {

    return
  }

}
