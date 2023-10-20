import fs from 'fs-extra'
import fg from 'fast-glob'
import { resolve } from 'node:path'
import { NPM_LOCK, PNPM_LOCK, YARN_LOCK, pkgRoot } from './constants';
import { Agent, parseNi } from '@antfu/ni';
import { TypeAgent, TypePkgMeta } from './types';

// 获取当前项目的依赖
export async function getPackages() {
  const pkgPath = resolve(pkgRoot, 'package.json')
  const { devDependencies, dependencies } = await fs.readJSON(pkgPath)
  return {
    devDependencies,
    dependencies
  } as TypePkgMeta
};

// 处理当前项目的包管理器
export async function getPkgManager(): Promise<TypeAgent> {
  const pkgManager = fg
    .sync('*.yaml', {
      cwd: resolve(pkgRoot),
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


// 处理依赖用于控制台展示
export async function resolvePackages() {
  const { devDependencies, dependencies } = await getPackages()

  const pkgMeta = {
    dev: Object.keys(devDependencies).map(i => ({ message: i, name: `${i}:${devDependencies[i]}`, value: devDependencies[i] })),
    prd: Object.keys(dependencies).map(i => ({ message: i, name: `${i}:${dependencies[i]}`, value: dependencies[i] }))
  }

  return pkgMeta
}


export async function getCommand(agent: Agent, arg: string[]) {
  return parseNi(agent, arg)
}


// [包名:版本号] => [包名@版本号]
export function getCommonPkgNames(pkgList: string[]) {
  return pkgList.map(p => (p.split(':').join('@')))
}
