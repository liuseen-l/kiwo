import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK } from './constants';
import enquirer from 'enquirer'
export const pkgRoot = process.cwd();

interface TypePkgMeta {
  devDependencies: Record<string, string>;
  dependencies: Record<string, string>;
}

async function getPackages() {
  const pkgPath = resolve(pkgRoot, 'package.json')
  const { devDependencies, dependencies } = await fs.readJSON(pkgPath)
  return {
    devDependencies,
    dependencies
  } as TypePkgMeta
};

async function resolveManager(isDev: boolean) {
  const pkgManager = fg
    .sync('*.yaml', {
      cwd: resolve(process.cwd()),
      onlyFiles: true,
    })[0];

  const { devDependencies, dependencies } = await getPackages()
  console.log(devDependencies);

  const resolvedPkgMeta = {
    dev: Object.keys(devDependencies).map(i => ({ message: i, name: `${i}:${devDependencies[i]}`, })),
    prd: Object.keys(dependencies).map(i => ({ message: i, name: `${i}:${dependencies[i]}`, }))
  }


  if (pkgManager === PNPM_LOCK) {
    enquirer
      .prompt([
        {
          type: "multiselect",
          name: "move",
          message: "choose move dependencies",
          hint: "(Press <space> to select, <a> to toggle all, <i> to invert selection)",
          initial: 0,
          choices: isDev ? resolvedPkgMeta.dev : resolvedPkgMeta.prd
        },
      ]).then(earlyAnswers => {
        console.log(earlyAnswers);


      })


  }

  if (pkgManager === YARN_LOCK) {
    return 'yarn'
  }

  if (pkgManager === NPM_LOCK) {
    return 'npm'
  }

  return 'null'
}

async function resolveMove(isDev: boolean) {
  await resolveManager(isDev)
}

export async function resolveConfig<T>(options: any): Promise<void> {
  // move
  if (options.mode === 'move') {
    const isDev = options.D || options.d || options.devDependencies || false
    resolveMove(isDev)
    return
  }

  // remove
  if (options.r || options.remove) {
    return
  }
}
